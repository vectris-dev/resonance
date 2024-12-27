let theShader;
let sentiment = 1.0;

function preload() {
    theShader = loadShader('shader.vert', 'shader.frag');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    noStroke();
}

function draw() {
    shader(theShader);
    
    theShader.setUniform('u_resolution', [width, height]);
    theShader.setUniform('u_time', frameCount * 0.01);
    theShader.setUniform('u_sentiment', sentiment);
    
    rect(0, 0, width, height);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function updateSentiment(newSentiment) {
    sentiment = constrain(newSentiment, 0, 1);
} 