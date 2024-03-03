const { OpenAI } = require('openai');

async function generateEmbeddings(documents){

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });


    for(const document of documents){
        const input = document.replace(/\n/g, '');

        const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input: input
        });

        const [{ embedding }] = embeddingResponse.data;

        // Espera 20 segundos antes de la siguiente solicitud
        //Segun el mismo chatGPT el modelo de embeddings acepta solo 3 solicitudes por minuto, como tenia 4 documentos reboto lo primeravez y se coloco esta funcion
        await new Promise(resolve => setTimeout(resolve, 20000));

        return embedding;
    }
};


module.exports = {
    generateEmbeddings
};