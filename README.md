# PMS3003 Extension for micro:bit

อ่านค่าฝุ่น PM1.0 / PM2.5 / PM10 จากเซนเซอร์ PMS3003 ผ่าน UART Serial

## การต่อสาย

| PMS3003 | micro:bit |
|---------|-----------|
| VCC     | 5V (ภายนอก) |
| GND     | GND       |
| TXD     | P0 (RX)   |
| RXD     | P1 (TX)   |

> ⚠️ เซนเซอร์ต้องการไฟ 5V — ห้ามต่อกับ 3.3V ของ micro:bit โดยตรง

## การใช้งาน (Blocks)

```
เมื่อเริ่มต้น:
  ตั้งค่า PMS3003 RX [P0] TX [P1]

ตลอดเวลา:
  อ่านค่า PMS3003
  แสดงค่า [PM2.5]
  หยุด 2000 ms
```

## บล็อกที่มี

| บล็อก | หน้าที่ |
|-------|---------|
| `ตั้งค่า PMS3003 RX _ TX _` | กำหนดขาและ baud rate — ใส่ใน on start |
| `อ่านค่า PMS3003` | อ่าน frame จากเซนเซอร์ — ใส่ใน forever |
| `แสดงค่า PM2.5` | แสดงตัวเลขบน LED matrix |
| `ค่า PM2.5 (µg/m³)` | คืนค่าตัวเลข — ใช้กับ serial / radio |

## ติดตั้ง Extension

1. เปิด [MakeCode micro:bit](https://makecode.microbit.org)
2. สร้างโปรเจกต์ใหม่
3. คลิก **Extensions** → วาง GitHub URL ของ repo นี้
4. บล็อก PMS3003 จะปรากฏในแถบด้านซ้าย
