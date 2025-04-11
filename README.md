# Using Replicate in Node.js with p5.js for Machine Learning Models

This repo demonstrates how to use the Replicate API with p5.js through a Node.js server to run various AI models. This example is for the [ML for Creative Coding](https://github.com/shiffman/ML-for-Creative-Coding) class at ITP, NYU.

## Setup

1. Clone this repository
2. Create a `.env` file and add your Replicate API token:
   ```
   REPLICATE_API_TOKEN=your_token_here
   ```
3. Install dependencies: `npm install`
4. Run the server: `node server.js`
5. Open your browser to `http://localhost:3001`

## About Replicate

[Replicate](https://replicate.com/) is a platform for running machine learning models in the cloud from your own code. [Browse models](https://replicate.com/explore).

For detailed usage, setup, and more, here is the official [Replicate Documentation for Node.js](https://replicate.com/docs/get-started/nodejs).

## Examples

- **Text Generation**: Generate text using the Llama 3 model
- **Image Generation**: Generate images from text prompts
- **Inpainting**: Edit parts of an image by drawing a mask
- **Image-to-Image**: Transform simple geometric drawings into detailed images
