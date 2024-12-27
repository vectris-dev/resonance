let theShader;
let sentiment = 1.0;
const RSS_ENDPOINT = "https://rss.nytimes.com/services/xml/rss/nyt/World.xml";

function preload() {
  theShader = loadShader("shader.vert", "shader.frag");
  fetchNews();
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
}

function draw() {
  shader(theShader);

  theShader.setUniform("u_resolution", [width, height]);
  theShader.setUniform("u_time", frameCount * 0.01);
  theShader.setUniform("u_sentiment", sentiment);

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
    const response = await fetch(RSS_ENDPOINT);
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    const items = xmlDoc.getElementsByTagName("item");

    const titles = [];
    for (i = 0; i < items.length; i++) {
      const title = items[i].getElementsByTagName("title")[0].textContent;
      if (!title.includes("Briefing")) {
        titles.push(title);
      }
    }

    console.log("Latest NYT World News headlines:");
    titles.forEach((title, i) => console.log(`${title}`));

    return titles;
  } catch (error) {
    console.error("Error fetching news:", error);
  }
}
