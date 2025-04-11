function setup() {
  createCanvas(400, 400);
  noLoop();
  background(0);

  // Create an input field for user prompt with a default text
  let prompt = createInput('Type your prompt here');

  // Set the width of the input field to match the canvas
  prompt.style('width', '400px');

  // Create a button for generating images; on click, call generateImage function
  createButton('generate').mousePressed(generateImage);

  // Function to handle image generation request
  async function generateImage() {
    // Send a POST request to the '/api/image' endpoint with the prompt as input
    const response = await fetch('/api/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: prompt.value() }),
    });

    // Parse the response data as JSON
    const data = await response.json();
    console.log(data);

    // Load the generated image from the base64 data and call gotImage function
    loadImage('data:image/png;base64,' + data.image, gotImage);
  }
}

// Function to display the loaded image on the canvas
function gotImage(img) {
  image(img, 0, 0, width, height);
}