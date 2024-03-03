const { OpenAIEmbeddings } = require('langchain/embeddings/openai')
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { pineconeClient } = require('./PineconeClient');
const { DirectoryLoader } = require('langchain/document_loaders/fs/directory');
const { PDFLoader } = require('langchain/document_loaders/fs/pdf');
const dotenv = require('dotenv');
dotenv.config();


async function updatePinecone(client) {

  const loader = new DirectoryLoader("../../PDFs", {
      ".pdf": (path) => new PDFLoader(path),
  });

  const docs = await loader.load();

  console.log("Recuperando datos del inidice de Pinecone...");
  // 3. Recuperar el índice Pinecone
  const index = client.Index('clinica');
  // 4. Registrar el nombre del índice recuperado
  console.log(`indice recuperado: ${process.env.PINECONE_INDEX_NAME}`);

  // 5. Procesa cada documento del array
  for (const doc of docs) {
      console.log(`Procesando documento: ${doc.metadata.source}`);
      const txtPath = doc.metadata.source;
      const text = doc.pageContent;

      const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000,
      });

      console.log("Cortando texto en fragmentos...");
      // 7. Dividir texto en fragmentos (chunks)
      const chunks = await textSplitter.createDocuments([text]);
      console.log(`Textos divididos en ${chunks.length} fragmentos`);

      console.log(
          `Llamado al endpoint de Embeddings de OpenAI para vectorizar los ${chunks.length} fragmentos...`
      );

      const embeddingsArrays = await new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
      }).embedDocuments(
          chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
      );

      console.log("Finilizando la incrustación de los embeddings...");
      console.log(
          `Se han creado ${chunks.length} vectores con id, valores, y metadata...`
      );

      const batchSize = 100;
      let batch = [];
      for (let idx = 0; idx < chunks.length; idx++) {
          const chunk = chunks[idx];
          const vector = {
              id: `${txtPath}_${idx}`,
              values: embeddingsArrays[idx],
              metadata: {
                  ...chunk.metadata,
                  loc: JSON.stringify(chunk.metadata.loc),
                  pageContent: chunk.pageContent,
                  txtPath: txtPath,
              },
          };
          batch.push(vector);
          // Cuando el lote está lleno o es el último elemento, inserta los vectores
          if (batch.length === batchSize || idx === chunks.length - 1) {
              await index.upsert({
                  upsertRequest: {
                      vectors: batch,
                  },
              });
              // Vaciar el lote
              batch = [];
              // Esperar 20 segundos
              await new Promise(resolve => setTimeout(resolve, 20000));
          }
      }
      // 10. Registrar el número de vectores actualizados
      console.log(`Índice de Pinecone actualizado con ${chunks.length} vectores`);
  }
};

module.exports = {
  updatePinecone
}
