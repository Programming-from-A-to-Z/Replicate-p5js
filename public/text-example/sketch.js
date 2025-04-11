function setup() {
  noCanvas();
  noLoop();

  // Create an input field for user prompt with a default text
  let prompt = createInput('Type your prompt here');

  // Set the width of the input field to match the canvas
  prompt.style('width', '400px');

  // Create a button for generating text; on click, call generateText function
  createButton('generate').mousePressed(generateText);

  // Function to handle text generation request
  async function generateText() {
    // Send a POST request to the '/api/text' endpoint with the prompt as input
    const response = await fetch('/api/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: prompt.value() }),
    });

    // Parse the response data as JSON
    const data = await response.json();
    console.log(data);

    // Display the generated text on the webpage
    createP(data.output.join(''));
  }
}
