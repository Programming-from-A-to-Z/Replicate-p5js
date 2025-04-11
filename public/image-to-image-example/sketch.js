let textInput;
let generatedImg;
let canvas;

function setup() {
  canvas = createCanvas(512, 512);
  textInput = createInput('colorful fairy land');
  textInput.size(450);
  createButton('generate').mousePressed(generateImage);

  // Draw a simple geometric landscape
  drawScene();
}

function draw() {
  if (generatedImg) {
    image(generatedImg, 0, 0, width, height);
  } else {
    // If no generated image yet, show the geometric scene (it's already drawn)
  }
}

// Generate a new image using the Replicate API with img2img
async function generateImage() {
  console.log('Generating image...');
  let prompt = textInput.value();

  // Convert canvas to base64
  canvas.loadPixels();
  let imgBase64 = canvas.elt.toDataURL('image/jpeg');

  // Data to send to our server
  let data = {
    prompt: prompt,
    image: imgBase64,
    prompt_strength: 0.8,
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
  let response = await fetch('/api/img2img', options);
  console.log('Response received, loading image...');

  // Load the generated image
  let json = await response.json();
  console.log(json);
  loadImage('data:image/png;base64,' + json.image, gotImage);
}

function gotImage(results) {
  generatedImg = results;
  console.log('Image loaded.');
}

function drawScene() {
  // Sky gradient
  background(135, 206, 235); // Sky blue
  for (let y = 0; y < height / 2; y++) {
    let c = lerpColor(color(135, 206, 235), color(0, 0, 128), y / (height / 2));
    stroke(c);
    line(0, y, width, y);
  }

  // Sun
  fill(255, 204, 0);
  noStroke();
  circle(width * 0.8, height * 0.2, 80);

  // Clouds
  fill(255);
  noStroke();
  // Cloud 1
  ellipse(width * 0.2, height * 0.15, 80, 50);
  ellipse(width * 0.25, height * 0.15, 60, 40);
  ellipse(width * 0.15, height * 0.15, 60, 40);

  // Cloud 2
  ellipse(width * 0.6, height * 0.1, 70, 45);
  ellipse(width * 0.65, height * 0.1, 50, 35);
  ellipse(width * 0.55, height * 0.1, 50, 35);

  // Mountains
  fill(101, 67, 33); // Brown
  triangle(0, height * 0.5, width * 0.3, height * 0.2, width * 0.5, height * 0.5);
  fill(120, 81, 45); // Lighter brown
  triangle(width * 0.4, height * 0.5, width * 0.7, height * 0.25, width, height * 0.5);

  // Ground
  fill(76, 153, 0); // Green
  rect(0, height * 0.5, width, height * 0.5);

  // Trees
  // Tree 1
  fill(101, 67, 33); // Brown trunk
  rect(width * 0.2, height * 0.5, 20, 60);
  fill(0, 102, 0); // Dark green
  triangle(
    width * 0.2 - 40,
    height * 0.5,
    width * 0.2 + 10,
    height * 0.3,
    width * 0.2 + 60,
    height * 0.5
  );
  triangle(
    width * 0.2 - 30,
    height * 0.4,
    width * 0.2 + 10,
    height * 0.2,
    width * 0.2 + 50,
    height * 0.4
  );

  // Tree 2
  fill(101, 67, 33); // Brown trunk
  rect(width * 0.8, height * 0.5, 20, 70);
  fill(0, 102, 0); // Dark green
  triangle(
    width * 0.8 - 40,
    height * 0.5,
    width * 0.8 + 10,
    height * 0.35,
    width * 0.8 + 60,
    height * 0.5
  );
  triangle(
    width * 0.8 - 30,
    height * 0.4,
    width * 0.8 + 10,
    height * 0.25,
    width * 0.8 + 50,
    height * 0.4
  );

  // Lake
  fill(0, 119, 190); // Blue
  ellipse(width * 0.5, height * 0.7, width * 0.4, height * 0.2);
}
