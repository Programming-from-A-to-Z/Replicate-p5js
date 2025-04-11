// Import required modules
import Replicate from 'replicate';
import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create an express application
const app = express();
// Increase payload size limit to 50MB for handling image data
app.use(bodyParser.json({ limit: '50mb' }));
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
  const model = 'itpnyu/shiffler:9e95edd872fcbc9db40154e1cd260a4b60ed80c9d0d3473d74073c08ffd602d4';

  // Prepare input
  const input = {
    prompt: request.body.prompt,
  };
  console.log(input);

  // Run the image generation model and await its output
  const output = await replicate.run(model, { input });

  // Fetch the image data
  const imageData = output[0];
  const imageResponse = await fetch(imageData);
  // Convert the image data to an array buffer
  const arrayBuffer = await imageResponse.arrayBuffer();
  // Convert the array buffer to a buffer
  const buffer = Buffer.from(arrayBuffer);
  // Encode the buffer as a base64 string
  const base64Image = buffer.toString('base64');
  // Send the base64-encoded image as a JSON response
  response.json({ image: base64Image });
});

// Define endpoint for handling inpainting requests
app.post('/api/inpainting', async (request, response) => {
  // Stable Diffusion inpainting model
  const model = 'stability-ai/stable-diffusion-inpainting';
  const version = '95b7223104132402a9ae91cc677285bc5eb997834bd2349fa486f53910fd68b3';

  // Extract data from request
  const input = {
    prompt: request.body.prompt,
    image: request.body.image,
    mask: request.body.mask,
  };

  console.log('Inpainting request received');

  // Run the inpainting model
  const output = await replicate.run(`${model}:${version}`, { input });

  // Fetch the image data
  const imageData = output[0];
  const imageResponse = await fetch(imageData);
  const arrayBuffer = await imageResponse.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Image = buffer.toString('base64');

  // Send the base64-encoded image
  response.json({
    image: base64Image,
  });
});

// Define endpoint for handling image-to-image requests
app.post('/api/img2img', async (request, response) => {
  // Stable Diffusion image-to-image model
  const model = 'stability-ai/stable-diffusion-3';

  // Extract data from request
  const input = {
    prompt: request.body.prompt,
    image: request.body.image,
    prompt_strength: request.body.prompt_strength || 0.8,
  };

  console.log('Image-to-image request received');

  // Run the image-to-image model
  const output = await replicate.run(`${model}`, { input });

  // Fetch the image data
  const imageData = output[0];
  const imageResponse = await fetch(imageData);
  const arrayBuffer = await imageResponse.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Image = buffer.toString('base64');

  // Send the base64-encoded image
  response.json({
    image: base64Image,
  });
});

const PORT = process.env.PORT || 3001;

// Start the server and log a message with the URL
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
