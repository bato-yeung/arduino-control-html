#define TRIG_PIN 9
#define ECHO_PIN 10

void setup() {
    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
    Serial.begin(9600);
}

void loop() {
    // Send a 10-microsecond pulse to the TRIG pin
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);

    // Measure the duration of the pulse on the ECHO pin
    long duration = pulseIn(ECHO_PIN, HIGH);

    // Calculate the distance in centimeters
    float distance = duration * 0.034 / 2;

    // Send the distance to the Serial port
    Serial.println(distance);

    // Wait before the next measurement
    delay(100);
}
