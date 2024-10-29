// Import required modules
import Replicate from 'replicate';
import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create an express application
const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize Replicate client with API token from environment variables
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Define endpoint for handling text generation requests
app.post('/api/text', async (request, response) => {
  // Set the model
  const model = 'meta/meta-llama-3-8b-instruct';

  const input = {
    prompt: request.body.prompt,
    system_prompt: 'You are the Llama AI model hosted on Replicate.',
  };
  console.log(input);

  // Run the text generation model and await its output
  const output = await replicate.run(model, { input });
  console.log(output);
  response.json({ output });
});

// Define endpoint for handling image generation requests
app.post('/api/image', async (request, response) => {
  const model =
    'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc';

  // Prepare input
  const input = {
    prompt: request.body.prompt,
  };
  console.log(input);

  // Run the image generation model and await its output
  const output = await replicate.run(model, { input });

  // Extract the image URL from the output
  const url = output[0];
  console.log(url);

  // Fetch the image data from the generated URL
  const imageResponse = await fetch(url);
  // Convert the image data to an array buffer
  const arrayBuffer = await imageResponse.arrayBuffer();
  // Convert the array buffer to a buffer
  const buffer = Buffer.from(arrayBuffer);
  // Encode the buffer as a base64 string
  const base64Image = buffer.toString('base64');
  // Send the base64-encoded image as a JSON response
  response.json({ image: base64Image });
});

const PORT = process.env.PORT || 3001;

// Start the server and log a message with the URL
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
