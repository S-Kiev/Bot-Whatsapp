const { PineconeClient } = require('@pinecone-database/pinecone');
const dotenv = require('dotenv');
dotenv.config();

async function pineconeClient () {
    const client = new PineconeClient();
    await client.init({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIROMENT,
    });

    return client;
}

module.exports = {
    pineconeClient
}