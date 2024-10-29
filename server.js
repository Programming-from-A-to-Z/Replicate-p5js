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
  // Set model and version identifiers for text generation using Llama-2 model
  const version = '8e6975e5ed6174911a6ff3d60540dfd4844201974602551e10e9e87ab143d81e';
  const model = 'meta/meta-llama-3-8b-instruct';

  // Prepare input payload with prompt and system prompt
  const input = {
    prompt: request.body.prompt,
    system_prompt: 'You are the Llama AI model hosted on Replicate.',
  };

  // Log the input payload for debugging
  console.log(input);

  // Run the text generation model and await its output
  const output = await replicate.run(`${model}:${version}`, { input });

  // Send the model output as a JSON response
  response.json({ output });
});

// Define endpoint for handling image generation requests
app.post('/api/image', async (request, response) => {
  // Set model and version identifiers for image generation using SDXL model
  const model = 'stability-ai/sdxl';
  const version = '39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b';

  // Prepare input payload with the provided prompt
  const input = {
    prompt: request.body.prompt,
  };

  // Log the input payload for debugging
  console.log(input);

  // Run the image generation model and await its output
  const output = await replicate.run(`${model}:${version}`, { input });

  // Extract the image URL from the output
  const url = output[0];

  // Log the image URL for debugging
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

// Define the port for the server, using environment variable or defaulting to 3001
const PORT = process.env.PORT || 3001;

// Start the server and log a message with the URL
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
