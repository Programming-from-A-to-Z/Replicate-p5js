let textInput;
let img;
let canvas;
let generatedImg;
let painting;

function preload() {
  img = loadImage('kitten.jpg');
}

function setup() {
  canvas = createCanvas(400, 400);
  textInput = createInput('blue eyes');
  textInput.size(350);
  createButton('generate').mousePressed(generateImage);

  // Create a graphics layer for the mask
  painting = createGraphics(width, height);
  painting.background(0);
  image(img, 0, 0, width, height);
}

function draw() {
  // Display the drawing on top
  if (mouseIsPressed) {
    stroke(255);
    strokeWeight(20);
    line(mouseX, mouseY, pmouseX, pmouseY);
    painting.stroke(255);
    painting.strokeWeight(20);
    painting.line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

// Generate a new image using the Replicate API with inpainting
async function generateImage() {
  console.log('Generating image...');
  let prompt = textInput.value();

  // Convert input image and mask to base64
  canvas.loadPixels();
  let imgBase64 = canvas.canvas.toDataURL('image/jpeg');
  painting.loadPixels();
  let maskBase64 = painting.canvas.toDataURL('image/png');

  // Data to send to our server
  let data = {
    prompt: prompt,
    image: imgBase64,
    mask: maskBase64,
  };

  // Request options for the API call
  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  // Send request to our server
  let response = await fetch('/api/inpainting', options);
  console.log('Response received, loading image...');

  // Load the generated image
  let json = await response.json();
  console.log(json);
  // Load the image from the base64 data
  loadImage('data:image/png;base64,' + json.image, gotImage);
}

function gotImage(results) {
  generatedImg = results;
  image(generatedImg, 0, 0, width, height);
  painting.background(0);
  console.log('Image loaded.');
}
