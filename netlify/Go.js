// File: netlify/functions/fetchLuxury.js
const fetch = require('node-fetch');

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

exports.handler = async function (event, context) {
  if (!UNSPLASH_ACCESS_KEY) {
    console.error("Missing UNSPLASH_ACCESS_KEY in environment variables.");
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Unsplash API key not set' })
    };
  }

  try {
    const count = 20;
    const url = `https://api.unsplash.com/photos/random?query=luxury+property&count=${count}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`;
    const res = await fetch(url);
    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Unsplash API error:", errorBody);
      throw new Error('Failed to fetch from Unsplash API');
    }

    const images = await res.json();

    const results = images.map(img => ({
      image: img?.urls?.regular || '',
      title: img?.alt_description || 'Luxury Property',
      description: img?.description || img?.alt_description || 'A beautiful luxury property.'
    })).filter(img => img.image);

    return {
      statusCode: 200,
      body: JSON.stringify({ results })
    };

  } catch (error) {
    console.error('FetchLuxury Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    };
  }
};
