const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

async function getTranscription(binaryAudio) {
  try {
    const tempFilePath = path.join(os.tmpdir(), 'temp_audio.ogg');
    
    // Guardar el binario de audio en un archivo temporal
    await fs.promises.writeFile(tempFilePath, binaryAudio);
    
    try{
        const data = new FormData();
        data.append('file', fs.createReadStream(tempFilePath));
        data.append('model', 'whisper-1');

        const config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://api.openai.com/v1/audio/transcriptions',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            ...data.getHeaders()
          },
          data: data
        };

        const response = await axios.request(config);

        // Borra el archivo temporal después de usarlo
        await fs.promises?.unlink(tempFilePath);

        return response.data.text;
    } catch(err){
        // Si algo sale mal borrar de todas formas
        await fs.promises?.unlink(tempFilePath);
        console.log(err);
        throw err;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  getTranscription
}