// 1. Importar módulos necesarios
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const { OpenAI } = require('langchain/llms/openai');
const { loadQAStuffChain } = require('langchain/chains');
const { Document } = require('langchain/document');
const { pineconeClient } = require('./PineconeClient');
const dotenv = require('dotenv');
dotenv.config();


// 2. Declarar la función queryPineconeAndQueryGPT
async function queryPineconeAndQueryGPT ( textUser ) {

  const question = textUser;

  const client = await pineconeClient();

// 3. Iniciar el proceso de preguntas
  console.log("consultando a la base de datos vectorial de Pinecone...");
  console.log(client);

// 4. Recuperar el índice Pinecone
  const index = client.Index(process.env.PINECONE_INDEX_NAME);

// 5. Generar los embeddings de la consulta del usuario
  const queryEmbedding = await new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  }).embedQuery( question );

// 6. consultar el índice Pinecone y retornar las 10 primeras coincidencias
  let queryResponse = await index.query({
    queryRequest: {
      topK: 10,
      vector: queryEmbedding,
      includeMetadata: true,
      includeValues: true,
    },
  });

  console.log(queryResponse);
// 7. Registrar el número de coincidencias
  console.log(`Se han encontrado ${queryResponse.matches.length} coincidencias...`);
// 8. Mostrando la consulta del usuario
  console.log(`Realizando la pregunta: ${question }...`);
  if (queryResponse.matches.length) {
// 9. Crear una instancia de OpenAI y cargar la QAStuffChain

    const llm = new OpenAI({ 
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: 'gpt-3.5-turbo',
        temperature: 0.7
    });

    const chain = loadQAStuffChain(llm);

// 10. Extraer y concatenar el contenido de las páginas de los documentos cotejados
    const concatenatedPageContent = queryResponse.matches
      .map((match) => match.metadata.pageContent)
      .join(" ");

    console.log(concatenatedPageContent);

// 11. Ejecutar la cadena (chain) con documentos de entrada y textUser
    const result = await chain.call({
      input_documents: [new Document({ pageContent: concatenatedPageContent })],
      question : question,
    });
// 12. Retornar la respuesta

    console.log(result.text);
    return result.text;
  } else {
// 13. Si no hay coincidencias retornar una respuesta concreta, por lo que no se consultará GPT-3 y se ahorrara el llamdo al API
    return "Lo siento pero no coincide con mi base de conocimientos, no tengo respuesta para este caso";
  }
};

module.exports = {
  queryPineconeAndQueryGPT
}