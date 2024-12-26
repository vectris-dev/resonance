let angle = 0;
let radius;

function setup() {
    createCanvas(windowWidth, windowHeight);
    radius = min(width, height) / 4;
    noFill();
    strokeWeight(2);
}

function draw() {
    background(0);
    stroke(255, 255, 255);
    
    translate(width / 2, height / 2);
    rotate(angle);
    
    for (let i = 0; i < 2; i++) {
        push();
        let scaleFactor = 1 + sin(frameCount * 0.02) * 0.2;
        scale(scaleFactor);
        drawFlowerOfLife(radius * (i + 1) / 6);
        pop();
    }
    
    angle += 0.005;
}

function drawFlowerOfLife(size) {
    circle(0, 0, size * 2);
    
    for (let i = 0; i < 6; i++) {
        let a = TWO_PI / 6 * i;
        let x = cos(a) * size;
        let y = sin(a) * size;
        circle(x, y, size * 2);
        
        for (let j = 0; j < 6; j++) {
            let a2 = TWO_PI / 6 * j;
            let x2 = x + cos(a2) * size;
            let y2 = y + sin(a2) * size;
            circle(x2, y2, size * 2);
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    radius = min(width, height) / 4;
} 