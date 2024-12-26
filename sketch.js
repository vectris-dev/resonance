let theShader;

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
    
    rect(0, 0, width, height);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
} 