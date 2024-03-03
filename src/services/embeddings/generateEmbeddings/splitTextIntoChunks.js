const { encode } = require('gpt-3-encoder');

const calculateTokens = text => encode(text).length;

const splitTextIntoChunks = (text) => {

    //Cambiar este valor segun el tamaño deseado de los fragmentos
    maxChunkSize = 512;

    //Define an array variable: chunks where we will store all the chunks
    const chunks = [];
  
    //Define a string variable: current Chunk where we will store the chunk being built
    //before inserting it into the chunks array
    let currentChunk = "";
  
    //get all sentences in the text and store them inside a variable: sentences
    const sentences = text.split('.');
  
    //Loop over the sentences
    sentences.forEach(sentence => {
      //For each sentence:
      //if the number of tokens in the combination of currentChunk and sentence < 2000
      //keep adding sentences to the currentChunk
      //otherwise add the sentence to the current chunk and insert ouput into chunks
  
      if (calculateTokens(currentChunk) > maxChunkSize) {
        const sentenceChunks = splitSentence(currentChunk, maxChunkSize);
        chunks.push(...sentenceChunks);
      }
  
      if (calculateTokens(currentChunk + sentence) < maxChunkSize) {
        currentChunk += sentence + "."
      } else {
        chunks.push(currentChunk.trim());
        currentChunk = sentence + "."; //set the new chunk to the sentence
      }
    });
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }
    return chunks;
  
    //if at the start of building a new chunk, 
    //the first sentence that has been inserted to the currentCheck is over 2000 tokens, 
    //split that sentence to chunks and insert them into the chunks array
  
    //return the chunks array
  }

module.exports = {
    splitTextIntoChunks
};