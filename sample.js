function DustSensor () {
    // ป้องกัน loop ซ้อนกัน
    if (isReading) {
        return
    }
    isReading = true
    // ค้นหา Header 0x42
    b1 = serial.readBuffer(1)
    if (b1[0] != 66) {
        isReading = false
        return
    }
    // ตรวจ byte ที่ 2
    b2 = serial.readBuffer(1)
    if (b2[0] != 77) {
        isReading = false
        return
    }
    // อ่าน 30 byte ที่เหลือ
    rest = serial.readBuffer(30)
    if (rest.length < 30) {
        isReading = false
        return
    }
    // คำนวณค่า
    pm1 = rest[2] * 256 + rest[3]
    pm2_5 = rest[4] * 256 + rest[5]
    pm10 = rest[6] * 256 + rest[7]
    // Sanity check — ค่าฝุ่นปกติไม่เกิน 999
    if (pm2_5 > 999 || pm1 > 999 || pm10 > 999) {
        isReading = false
        return
    }
    isReading = false
}
let pm10 = 0
let pm2_5 = 0
let pm1 = 0
let rest: Buffer = null
let b2: Buffer = null
let b1: Buffer = null
let isReading = false
serial.redirect(
SerialPin.P0,
SerialPin.P1,
BaudRate.BaudRate9600
)
basic.showIcon(IconNames.Yes)
basic.pause(500)
basic.clearScreen()
basic.forever(function () {
    DustSensor()
    basic.showNumber(pm1)
    basic.pause(2000)
    basic.showNumber(pm10)
    basic.pause(2000)
    basic.showNumber(pm2_5)
    basic.pause(2000)
})
