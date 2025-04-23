# arduino-control-html

This project provides a web-based interface to control Arduino devices. It allows users to interact with connected hardware through a simple and intuitive HTML interface.

## Features

- **Web Serial API Integration**: Connects to an Arduino device via the Web Serial API to read distance data from an HC-SR04 ultrasonic sensor.
- **Canvas Animation**: Displays an animated canvas where points move and interact dynamically.
- **Distance-Based Interaction**: Points on the canvas are repelled based on proximity to a mapped distance value from the HC-SR04 sensor.
- **Dynamic Triangles**: Points are connected with lines to form triangles, creating a visually engaging effect.

## Arduino Wiring

To use this project with the HC-SR04 ultrasonic sensor, connect your Arduino as follows:
- **VCC**: Connect to the 5V pin on the Arduino.
- **GND**: Connect to the ground pin on the Arduino.
- **Trig**: Connect to a digital pin (e.g., pin 9).
- **Echo**: Connect to another digital pin (e.g., pin 10).

Ensure all connections are secure before powering on the Arduino.