const { pineconeClient } = require('./PineconeClient');
const dotenv = require('dotenv');
dotenv.config();

async function createPineconeIndex (client) {

  
    console.log(`Chequeando si existe el indice: "clinica"...`);
    const existingIndexes = await client.listIndexes();
    if (!existingIndexes.includes('clinica')) {
      console.log(`Creando indice: "${'clinica'}"...`);
      const createClient = await client.createIndex({
        createRequest: {
          name: 'clinica',
          dimension: 1536,
          metric: "cosine",
        },
      });
      console.log(`Indice creado con el cliente:`, createClient);
      await new Promise((resolve) => setTimeout(resolve, 60000));
    } else {
      console.log(`"Indice ${process.env.PINECONE_INDEX_NAME}" ya existe`);
    }
  };

  module.exports = {
    createPineconeIndex
  }