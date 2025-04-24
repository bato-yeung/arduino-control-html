# arduino-control-html

This project demonstrates interactive visualization and hardware control by connecting an Arduino board to a web browser using the Web Serial API. It reads distance data from an HC-SR04 ultrasonic sensor and visualizes the data in real-time with dynamic canvas animation and generative art effects.

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

---

## Details about `script.js`

### Data Flow

- The browser connects to the Arduino via the Web Serial API when you click the "Connect to Arduino" button.
- The Arduino continuously sends distance values (in centimeters) from the HC-SR04 sensor over serial.
- The JavaScript code reads these values, parses them, and applies a moving average filter to smooth out noise.

### Smoothing (Moving Average)

- The most recent 5 distance readings are stored in a buffer.
- Each new value is added to the buffer, and the oldest is removed if necessary.
- The displayed value and the value used for canvas mapping are the average of this buffer, reducing sudden jumps.

### Mapping to Canvas

- The (smoothed) distance value is mapped from the range **2–20 cm** to the full width of the canvas.
- If the value is outside this range, it is clipped to the nearest bound.
- The mapped position is used as a "virtual mouse" (mouseX) at the vertical center of the canvas.

### Visual Effects

- A white glow is drawn at the mapped position to indicate the current distance.
- 50 animated points move around the canvas.
- Points within 100 pixels of the "virtual mouse" are repelled, creating an interactive effect.
- The points are dynamically connected to their two nearest neighbors, forming triangles for a generative art effect.

### Debugging

- The raw serial data received from Arduino is logged to the browser console for troubleshooting.
- Only valid numeric lines are used for distance calculations.