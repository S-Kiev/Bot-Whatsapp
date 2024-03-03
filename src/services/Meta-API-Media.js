const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

async function getUrlMedia(idAudio) {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://graph.facebook.com/v18.0/${idAudio}/`,
    headers: { 
      'Authorization': `Bearer ${process.env.WHATSAPP_CLOUD_API_KEY}`
    }
  };
  
  
  try {
    const response = await axios.request(config);
    return response.data.url;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

async function getBinaryMedia(url) {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: url,
      responseType: 'arraybuffer',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_CLOUD_API_KEY}`
      }
    };
  
    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
};

module.exports = {
  getUrlMedia,
  getBinaryMedia
}