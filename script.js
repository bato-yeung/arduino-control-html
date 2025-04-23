window.onload = function () {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const distanceValueElem = document.getElementById('distanceValue');
    // Track input from Arduino
    let mouseX = null;
    const mouseY = height / 2; // Fix mouseY at the center of the canvas

    // For smoothing the distance value
    const distanceBuffer = [];
    const bufferSize = 5; // Moving average window size

    // Set up Web Serial API
    document.getElementById('connectButton').addEventListener('click', async () => {
        try {
            const port = await navigator.serial.requestPort();
            await port.open({ baudRate: 9600 });

            const textDecoder = new TextDecoderStream();
            const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
            const reader = textDecoder.readable.getReader();

            console.log('Connected to Arduino');
            let buffer = '';
            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    reader.releaseLock();
                    break;
                }
                if (value) {
                    buffer += value;
                    let lines = buffer.split('\n');
                    buffer = lines.pop(); // 保留最後一個不完整的
                    for (let line of lines) {
                        line = line.trim();
                        if (!line) continue;
                        console.log('Raw:', line); // Debug: 查看收到的原始資料
                        const distance = parseFloat(line);
                        if (!isNaN(distance)) {
                            // Add to buffer and keep buffer size
                            distanceBuffer.push(distance);
                            if (distanceBuffer.length > bufferSize) {
                                distanceBuffer.shift();
                            }
                            // Calculate average
                            const avgDistance = distanceBuffer.reduce((a, b) => a + b, 0) / distanceBuffer.length;
                            // Map distance (2-20cm) to canvas width
                            const minDist = 2, maxDist = 20;
                            const clipped = Math.min(Math.max(avgDistance, minDist), maxDist);
                            mouseX = ((clipped - minDist) / (maxDist - minDist)) * width;
                            if (distanceValueElem) {
                                distanceValueElem.textContent = avgDistance.toFixed(2);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error connecting to Arduino:', error);
        }
    });

    // Generate random points
    const points = [];
    const numPoints = 50; // Number of points to generate
    for (let i = 0; i < numPoints; i++) {
        points.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 1, // Random velocity in x
            vy: (Math.random() - 0.5) * 1, // Random velocity in y
        });
    }

    function updatePoints() {
        // Update point positions
        for (let i = points.length - 1; i >= 0; i--) {
            const point = points[i];

            // If the mouse is nearby, repel the point
            if (mouseX !== null && mouseY !== null) {
                const dx = point.x - mouseX;
                const dy = point.y - mouseY;
                const distance = Math.hypot(dx, dy);

                if (distance < 100) { // Repel points within 100px of the mouse
                    const angle = Math.atan2(dy, dx);
                    point.vx += Math.cos(angle) * 0.1;
                    point.vy += Math.sin(angle) * 0.1;
                }
            }

            point.x += point.vx;
            point.y += point.vy;

            // Remove points that go outside the canvas
            if (point.x < 0 || point.x > width || point.y < 0 || point.y > height) {
                points.splice(i, 1);
            }
        }
    }

    function drawGlow() {
        if (mouseX !== null) {
            ctx.save();
            ctx.globalAlpha = 1;
            ctx.shadowColor = 'white';
            ctx.shadowBlur = 30;
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, 20, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.restore();
        }
    }

    function drawTriangles() {
        ctx.clearRect(0, 0, width, height); // Clear the canvas
        ctx.fillStyle = '#000'; // Background color
        ctx.fillRect(0, 0, width, height);

        // Draw glow for mouseX position
        drawGlow();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'; // Line color

        // Draw triangles connecting nearest neighbors
        for (let i = 0; i < points.length; i++) {
            const startPoint = points[i];

            // Find the two nearest points
            const nearestPoints = points
                .filter((_, index) => index !== i)
                .sort((a, b) => {
                    const distA = Math.hypot(a.x - startPoint.x, a.y - startPoint.y);
                    const distB = Math.hypot(b.x - startPoint.x, b.y - startPoint.y);
                    return distA - distB;
                })
                .slice(0, 2);

            if (nearestPoints.length < 2) continue;

            // Draw the triangle
            ctx.beginPath();
            ctx.moveTo(startPoint.x, startPoint.y);
            ctx.lineTo(nearestPoints[0].x, nearestPoints[0].y);
            ctx.lineTo(nearestPoints[1].x, nearestPoints[1].y);
            ctx.closePath();
            ctx.stroke();
        }
    }

    function animate() {
        updatePoints();
        drawTriangles();

        // Add new points if needed to maintain the number of points
        while (points.length < numPoints) {
            points.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
            });
        }

        requestAnimationFrame(animate);
    }

    animate(); // Start the animation loop
};
