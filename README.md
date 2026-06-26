# PMS3003 Extension for micro:bit

Read PM1.0 / PM2.5 / PM10 dust values from a PMS3003 sensor through UART serial.

## Wiring

| PMS3003 | micro:bit |
|---------|-----------|
| VCC     | External 5V |
| GND     | GND       |
| TXD     | P1 (RX)   |
| RXD     | P0 (TX)   |

> The sensor requires 5V power. Do not power it directly from the micro:bit 3.3V pin.

## Usage (Blocks)

```
on start:
  setup PMS3003 RX [P1] TX [P0]

forever:
  read PMS3003
  show [PM2.5]
  pause 2000 ms
```

## Blocks

| Block | Purpose |
|-------|---------|
| `setup PMS3003 RX _ TX _` | Set serial pins and baud rate. Place in on start. |
| `read PMS3003` | Read a sensor frame. Place in forever. |
| `show PM2.5` | Show the selected value on the LED matrix. |

## Install Extension

1. Open [MakeCode micro:bit](https://makecode.microbit.org).
2. Create a new project.
3. Click **Extensions** and paste this repository URL.
4. The PMS3003 block category will appear in the toolbox.
