// ตัวอย่างการใช้งาน PMS3003 Extension
// ใส่โค้ดนี้ใน MakeCode เพื่อทดสอบ

// === on start ===
PMS3003.setup(SerialPin.P0, SerialPin.P1)

// === forever ===
basic.forever(function () {
    PMS3003.readSensor()
    PMS3003.showValue(PMS3003.PMType.PM2_5)
    basic.pause(2000)
})
