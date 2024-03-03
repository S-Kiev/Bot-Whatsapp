const { generateEmbeddings } = require('../generateEmbeddings/generateEmbeddings');
const { getEmbeddings } = require('./getEmbeddings');
const { findNearestNeighbors } = require('./nearestNeighbours');
const { runCompletion } = require('./ChatGPTServiceWithEmbeddings');

const chatWithPDFs = async (text) =>{

    console.log(text);

    const tableName = 'embaddings';

      const embedding = await generateEmbeddings(text);

      const embeddings = await getEmbeddings(tableName);

    //find nearest neighbours
    const nearestNeighbours = findNearestNeighbors({ embedding, embeddings, k: 3 });

    //build the context
    const contextArray = [];
    nearestNeighbours.forEach((neighbour, index) => {
        contextArray.push(`abstract ${index+1}: """${neighbour?.text || ''}"""`);
    })
      
    const context = contextArray.join(' ');
      
    // Pass the request text and context to the runCompletion function
    const completion = await runCompletion(text, context);
    
    // Return the completion as a JSON response
    return completion.choices[0].message.content

}

module.exports = {
    chatWithPDFs
}

