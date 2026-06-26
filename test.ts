// PMS3003 extension usage example
// Add this code in MakeCode for testing.

// === on start ===
PMS3003.setup(DustSensorModel.PMS3003, PMS3003Pin.P1, PMS3003Pin.P0)

// === forever ===
basic.forever(function () {
    PMS3003.readSensor()
    PMS3003.showValue(PMType.PM2_5)
    basic.pause(2000)
})
