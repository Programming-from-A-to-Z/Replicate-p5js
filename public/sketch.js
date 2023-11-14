function setup() {
  createCanvas(400, 400);
  noLoop();
  background(0);

  let prompt = createInput('Type your prompt here');
  prompt.style('width', '400px');
  createButton('generateText').mousePressed(generateText);
  createButton('generateImage').mousePressed(generateImage);

  async function generateText() {
    const response = await fetch('/api/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: prompt.value() }),
    });
    const data = await response.json();
    createP(data.output.join(''));
  }

  async function generateImage() {
    const response = await fetch('/api/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: prompt.value() }),
    });
    const data = await response.json();
    console.log(data);
    loadImage('data:image/png;base64,' + data.image, gotImage);
  }
}

function gotImage(img) {
  image(img, 0, 0, width, height);
}
