/**
 * PMS3003 Air Quality Sensor Extension for micro:bit
 */

// Enums must stay outside the namespace for MakeCode blocks.
enum PMType {
    //% block="PM1.0"
    PM1 = 0,
    //% block="PM2.5"
    PM2_5 = 1,
    //% block="PM10"
    PM10 = 2
}

enum PMS3003Pin {
    //% block="P0"
    P0 = 0,
    //% block="P1"
    P1 = 1,
    //% block="P2"
    P2 = 2
}

//% color="#2ecc71" weight=80 icon="\uf72e" block="PMS3003"
namespace PMS3003 {

    let _pm1 = 0
    let _pm2_5 = 0
    let _pm10 = 0
    let _isReading = false
    let _initialized = false
    let _rxBuffer: number[] = []

    /**
     * Configure the PMS3003 sensor. Place this block in on start.
     * @param rx RX pin eg: PMS3003Pin.P1
     * @param tx TX pin eg: PMS3003Pin.P0
     */
    //% blockId="pms3003_setup"
    //% block="setup dust sensor RX %rx TX %tx"
    //% weight=100
    //% group="Setup"
    export function setup(rx: PMS3003Pin, tx: PMS3003Pin): void {
        serial.redirect(toSerialPin(tx), toSerialPin(rx), BaudRate.BaudRate9600)
        _initialized = true
        _isReading = false
        _rxBuffer = []
    }

    function toSerialPin(pin: PMS3003Pin): SerialPin {
        if (pin == PMS3003Pin.P0) return SerialPin.P0
        if (pin == PMS3003Pin.P1) return SerialPin.P1
        return SerialPin.P2
    }

    /**
     * Read dust values from the sensor. Place this block in forever.
     */
    //% blockId="pms3003_read"
    //% block="read PMS3003"
    //% weight=90
    //% group="Read"
    export function readSensor(): void {
        if (!_initialized || _isReading) return
        _isReading = true

        let data = serial.readBuffer(0)
        for (let i = 0; i < data.length; i++) {
            _rxBuffer.push(data[i])
        }

        while (_rxBuffer.length > 96) {
            _rxBuffer.removeAt(0)
        }

        while (_rxBuffer.length >= 32) {
            if (_rxBuffer[0] != 0x42 || _rxBuffer[1] != 0x4D) {
                _rxBuffer.removeAt(0)
                continue
            }

            let checksum = 0
            for (let i = 0; i < 30; i++) {
                checksum += _rxBuffer[i]
            }

            let csFrame = _rxBuffer[30] * 256 + _rxBuffer[31]
            if (checksum != csFrame) {
                _rxBuffer.removeAt(0)
                continue
            }

            let newPm1 = _rxBuffer[4] * 256 + _rxBuffer[5]
            let newPm2_5 = _rxBuffer[6] * 256 + _rxBuffer[7]
            let newPm10 = _rxBuffer[8] * 256 + _rxBuffer[9]

            if (newPm1 <= 999 && newPm2_5 <= 999 && newPm10 <= 999) {
                _pm1 = newPm1
                _pm2_5 = newPm2_5
                _pm10 = newPm10
            }

            for (let i = 0; i < 32; i++) {
                _rxBuffer.removeAt(0)
            }
        }

        _isReading = false
    }

    /**
     * Show the selected dust value on the micro:bit display.
     * @param type dust value type
     */
    //% blockId="pms3003_show"
    //% block="show %type"
    //% weight=80
    //% group="Display"
    export function showValue(type: PMType): void {
        let val = 0
        if (type == PMType.PM1) val = _pm1
        else if (type == PMType.PM2_5) val = _pm2_5
        else val = _pm10
        basic.showNumber(val)
    }

    /**
     * Return the selected dust value.
     * @param type dust value type
     */
    //% blockId="pms3003_value"
    //% block="dust value %type"
    //% weight=70
    //% group="Display"
    export function getValue(type: PMType): number {
        if (type == PMType.PM1) return _pm1
        if (type == PMType.PM2_5) return _pm2_5
        return _pm10
    }
}
