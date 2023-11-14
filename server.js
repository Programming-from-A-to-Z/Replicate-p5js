import Replicate from 'replicate';
import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.post('/api/text', async (request, response) => {
  const version =
    '8e6975e5ed6174911a6ff3d60540dfd4844201974602551e10e9e87ab143d81e';
  const model = 'meta/llama-2-7b-chat';
  const input = {
    prompt: request.body.prompt,
    system_prompt: 'You are the Llama AI model hosted on Replicate.',
  };
  console.log(input);
  const output = await replicate.run(`${model}:${version}`, { input });
  response.json({ output });
});

app.post('/api/image', async (request, response) => {
  const model = 'stability-ai/sdxl';
  const version =
    '39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b';
  const input = {
    prompt: request.body.prompt,
  };
  console.log(input);
  const output = await replicate.run(`${model}:${version}`, { input });
  const url = output[0];
  console.log(url);
  const imageResponse = await fetch(url);
  const arrayBuffer = await imageResponse.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Image = buffer.toString('base64');
  response.json({ image: base64Image });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
