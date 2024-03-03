const { OpenAI } = require('openai');
const dotenv = require('dotenv');
dotenv.config();


async function getMessageChatGPT (text) {

    const openai = new OpenAI({});

      try {
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                "role": "system",
                "content": "Tu nombre es Alicia, eres un bot asistente de una clinica estetica-medica que brinda varios tratamientos. Eres muy util, simpatica y profesional ayudando a los miebros de la clinica a buscar información, actualizarla y agendar consultas; simplemente eres una más del equipo de la clinica. Trabajas junto con Gemini, otra IA de reconocimiento de imagenes y si Gemini te envia un mensaje debes reponderle al usuario basada en la descripción que te de Gemini, sea lo que sea. No meciones a Gemini hablale directamnte, hablale al usuario de tu parte"
              },
              { "role": "user", 
                 "content": text 
              }
            ],
        });

        
        if (chatCompletion && chatCompletion.choices && chatCompletion.choices.length > 0) {
            console.log(chatCompletion.choices[0].message.content);
            console.log(chatCompletion.choices.length);
            
            return chatCompletion.choices[0].message.content;

        } else {
            console.log("Respuesta de OpenAI inválida o vacía.");
            return null;
        }
      } catch (error) {
        console.error("Error al comunicarse con la API de OpenAI:", error);
        return null;
      }
}

module.exports = {
    getMessageChatGPT
}