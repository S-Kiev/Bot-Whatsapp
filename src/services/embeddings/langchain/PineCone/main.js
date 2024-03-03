const { PineconeClient } = require('@pinecone-database/pinecone');
const { DirectoryLoader } = require('langchain/document_loaders/fs/directory');
const { PDFLoader } = require('langchain/document_loaders/fs/pdf');
const { createPineconeIndex } = require('./createPineconeIndex');
const { updatePinecone } = require('./updatePinecone');
const { queryPineconeVectorStoreAndQueryLLM } = require('./queryPineconeAndQueryGPT');

const dotenv = require('dotenv');
dotenv.config();


// 7. Configurar DirectoryLoader para cargar documentos del directorio "../../PDFs"

async function main(question){

    console.log('llego a ask: ' + question);

    const loader = new DirectoryLoader("../../PDFs", {
        ".pdf": (path) => new PDFLoader(path),
    });
    const docs = await loader.load();
    // 8. Configurar variables para los ajustes de nombre de archivo, pregunta e índice
    
    const indexName = "clinica";
    const vectorDimension = 1536;
    // 9. Inicializar el cliente Pinecone con la clave API y el entorno

    console.log(process.env.PINECONE_API_KEY);
    console.log(process.env.PINECONE_ENVIROMENT);

    const client = new PineconeClient();
    await client.init({
      apiKey: '1e26b211-3aff-4ee4-a2a2-cd566c7a9218',//process.env.PINECONE_API_KEY,
      environment: 'us-west1-gcp-free'//process.env.PINECONE_ENVIROMENT,
    });

    console.log(client);
    // 10. Ejecutar la función asíncrona main

    // En Desarrollo
    // 11. Comprobar si existe el índice Pinecone y crearlo si es necesario
      //await createPineconeIndex(client);

    // En Desarrollo
    // 12. Actualizar la base de datos vectorial de Pinecone con los embeddings de los documentos
      await updatePinecone(client, indexName, docs);

    // En Produccion
    // 13. Consultar el almacénla base de datos vectorial de Pinecone y el modelo GPT para obtener una respuesta
      //await queryPineconeVectorStoreAndQueryLLM(client, indexName, question);
}

(async () => {
  await main("¿Cuál es mi pregunta?");
})();

module.exports={
  main
}