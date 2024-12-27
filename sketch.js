let theShader;
let sentiment = 1.0;
// Please don't steal my api key lol you can get a free one from https://thenewsapi.com/
const API_ENDPOINT = 'https://api.thenewsapi.com/v1/news/top?api_token=o2nVs5g3POU9GlHFqfjIDEuQD9MfUMAGJbUSKl0q&locale=us&limit=3';

function preload() {
    theShader = loadShader('shader.vert', 'shader.frag');
    fetchNews();
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

async function fetchNews() {
    try {
        const response = await fetch(API_ENDPOINT);
        const data = await response.json();
        
        data.data.forEach(article => {
            console.log(article.description);
        });
    } catch (error) {
        console.error('Error fetching news:', error);
    }
} 