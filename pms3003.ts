/**
 * PMS3003 Air Quality Sensor Extension for micro:bit
 * Supports PM1.0, PM2.5, PM10 readings via UART serial
 */

//% color="#2ecc71" weight=80 icon="\uf72e" block="PMS3003"
namespace PMS3003 {

    let _pm1: number = 0
    let _pm2_5: number = 0
    let _pm10: number = 0
    let _isReading: boolean = false
    let _initialized: boolean = false

    /**
     * ตั้งค่าเซนเซอร์ PMS3003 — ใส่ใน "เมื่อเริ่มต้น" (on start)
     * @param rx ขา RX (รับข้อมูลจากเซนเซอร์) eg: SerialPin.P0
     * @param tx ขา TX (ส่งข้อมูลออก) eg: SerialPin.P1
     */
    //% blockId="pms3003_setup"
    //% block="ตั้งค่า PMS3003 RX %rx TX %tx"
    //% rx.fieldEditor="gridpicker"
    //% rx.fieldOptions.columns=3
    //% tx.fieldEditor="gridpicker"
    //% tx.fieldOptions.columns=3
    //% weight=100
    //% group="ตั้งค่า"
    export function setup(rx: SerialPin, tx: SerialPin): void {
        serial.redirect(rx, tx, BaudRate.BaudRate9600)
        _initialized = true
        _isReading = false
    }

    /**
     * อ่านค่าฝุ่นจากเซนเซอร์ — ใส่ใน "ตลอดเวลา" (forever)
     */
    //% blockId="pms3003_read"
    //% block="อ่านค่า PMS3003"
    //% weight=90
    //% group="อ่านค่า"
    export function readSensor(): void {
        if (!_initialized || _isReading) return
        _isReading = true

        // ค้นหา Header byte แรก 0x42
        let b1 = serial.readBuffer(1)
        if (b1[0] != 0x42) {
            _isReading = false
            return
        }

        // ตรวจ Header byte ที่สอง 0x4D
        let b2 = serial.readBuffer(1)
        if (b2[0] != 0x4D) {
            _isReading = false
            return
        }

        // อ่าน 30 byte ที่เหลือของ Frame
        let rest = serial.readBuffer(30)
        if (rest.length < 30) {
            _isReading = false
            return
        }

        // ตรวจ Checksum
        let checksum = 0x42 + 0x4D
        for (let i = 0; i < 28; i++) {
            checksum += rest[i]
        }
        let csFrame = rest[28] * 256 + rest[29]
        if (checksum != csFrame) {
            _isReading = false
            return
        }

        // คำนวณค่าฝุ่น (Atmospheric Environment)
        let newPm1   = rest[2] * 256 + rest[3]
        let newPm2_5 = rest[4] * 256 + rest[5]
        let newPm10  = rest[6] * 256 + rest[7]

        // Sanity check
        if (newPm1 <= 999 && newPm2_5 <= 999 && newPm10 <= 999) {
            _pm1   = newPm1
            _pm2_5 = newPm2_5
            _pm10  = newPm10
        }

        _isReading = false
    }

    /**
     * แสดงค่าฝุ่นบนหน้าจอ micro:bit — เลือกได้ว่าจะแสดงค่าใด
     * @param type ประเภทฝุ่นที่ต้องการแสดง
     */
    //% blockId="pms3003_show"
    //% block="แสดงค่า %type"
    //% weight=80
    //% group="แสดงผล"
    export function showValue(type: PMType): void {
        let val = 0
        if (type == PMType.PM1) {
            val = _pm1
        } else if (type == PMType.PM2_5) {
            val = _pm2_5
        } else {
            val = _pm10
        }
        basic.showNumber(val)
    }

    /**
     * รับค่าตัวเลขของฝุ่น — ใช้กับบล็อกอื่น เช่น serial หรือ radio
     * @param type ประเภทฝุ่นที่ต้องการ
     */
    //% blockId="pms3003_get"
    //% block="ค่า %type (µg/m³)"
    //% weight=70
    //% group="แสดงผล"
    export function getValue(type: PMType): number {
        if (type == PMType.PM1)   return _pm1
        if (type == PMType.PM2_5) return _pm2_5
        return _pm10
    }

    /**
     * ประเภทฝุ่น PM
     */
    export enum PMType {
        //% block="PM1.0"
        PM1 = 0,
        //% block="PM2.5"
        PM2_5 = 1,
        //% block="PM10"
        PM10 = 2
    }
}
