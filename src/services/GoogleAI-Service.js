const { GoogleGenerativeAI } = require('@google/generative-ai');
const { promises } = require('fs');
const os = require('os');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

async function geminiImageService (binaryMedia, mediaType, textUser, typeMessage) {

    try {
        const tempFilePath = path.join(os.tmpdir(), `temp_media.${mediaType}`);
    
        // Guardar el binario de audio en un archivo temporal
        await promises.writeFile(tempFilePath, binaryMedia);
    
        // 1. Configuracion del modelo
        const geminiAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const geminiConfig = { temperature: 0.9, topP: 1, topK: 1, maxOutputTokens: 4096 };
    
        // 2. Inicializar el modelo
        const model = geminiAI.getGenerativeModel({ model: "gemini-pro-vision", geminiConfig });
    
        const response = await generateContent(model, tempFilePath, textUser, mediaType, typeMessage);

        // Borra el archivo temporal después de usarlo
        await promises?.unlink(tempFilePath);

        return response;

    } catch (error) {
        // Borrar de todas formas si la llamada a Gemini sale mal
        await promises?.unlink(tempFilePath);
        console.log(error);
        throw error;
    }

}

async function generateContent(model, tempFilePath, textUser, mediaType, typeMessage) {
    try {
        // Cargar la imagen a base 64
        const imageData = await promises.readFile(tempFilePath);
        const imageBase64 = imageData.toString('base64');

        //El ususario puede enviar una consulta particular, sino hara una descripcion generica
        const text = textUser ? textUser : "Si la imagen es una factura quiero que digas explicitamnte 'quiero facturar' agregando los siguientes datos que debes identificar: el número de la consulta, el número de cliente, el costo total, cuanto fue abonado y el estatus de la factura cuyos valores posibles pueden ser:\n 1- total (cuando se ha pagado el total de la cuenta)\n 2- partial (cuando es pacial y no se ha abonado el 100%)\n 3- pending (cuando esta pendiente porque el cliente ha abonado 0)\n\n caso no sea una factura solo describe lo que ves \n\n  nombra cada elemento para identifiacarlo, ejemplo: 'N° Factura: 1'";

        console.log("----------------------------------------------------");
        console.log("Texto que le llega a Gemini");
        console.log(text);
        console.log("----------------------------------------------------");

        // Definir las partes
        const parts = [
            { text: text },
            {
              inlineData: {
                mimeType: `${typeMessage}/${mediaType}`,
                data: imageBase64
              }
            },
          ];

        // Generar el contenido a partir de los inputs de texto e imágenes
        const result = await model.generateContent({ contents: [{ role: "user", parts }] });
        const response = await result.response;
        console.log("----------------------------------------------------");
        console.log("Texto que responde Gemini");
        console.log(response.text());
        console.log("----------------------------------------------------");
        return response.text();
    } catch (error) {
      console.error('Error generando el contenido:', error);
      return "Ocurrio un error y no se pudo procesar la imagen"
    }
  }

module.exports ={
  geminiImageService
}