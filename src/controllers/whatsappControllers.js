const process = require('../shared/processMessage');
const modelMessageWhatsapp = require('../shared/whatsappModels');
const whatsappService = require('../services/whatsappService');
const MetaAPIMedia = require('../services/Meta-API-Media');
const whisper = require('../services/whisper-Service');
const google = require('../services/GoogleAI-Service');

const dotenv = require('dotenv');
dotenv.config();
//const whatsappService = require('../services/whatsappService');

const verifyToken = (req, res) =>{
    try {
        var accessToken = process.env.WHATSAPP_WEBHOOK_KEY;
        var token = req.query["hub.verify_token"];
        var challenge = req.query["hub.challenge"];


        if (challenge != null && token != null && token == accessToken) {
            res.send(challenge);
        } else {
            res.status(400).send();
        }

    } catch (error) {
        res.status(400).send();
    }
}

async function recivedMessage (req, res) {
    //console.log(req.body);
    try {
    var entry = (req.body['entry'])[0];
    var changes = (entry['changes'])[0];
    var value = changes['value'];
    var messageObject = value['messages'];


    if (typeof messageObject != 'undefined'){
        var messages = messageObject[0];
        var number = messages['from']; 
        var text = await getTextUser(messages);

        if (text != '') {

            await process.processMessage(text, number);
        } 

        //Seguir desde aqui
    }

    res.send('EVENT_RECEIVED');
    } catch (e) {

    res.send('EVENT_RECEIVED');
    }
}

async function getTextUser (messages) {

    var text = '';
    var typeMessage = messages['type'];

    if (typeMessage == 'text') {
        text = (messages['text'])['body'];
    }
    else if(typeMessage == 'audio'){

        let idAudio = (messages['audio'])['id'];

        let url = await MetaAPIMedia.getUrlMedia(idAudio);

        let binaryAudio = await MetaAPIMedia.getBinaryMedia(url);

        let transcription = await whisper.getTranscription(binaryAudio);

        console.log(transcription);

        text = transcription
    }

    else if (typeMessage == 'image' || typeMessage == 'video'){

        let textUser;
        let mediaType;

        if (typeMessage == 'image') {
            textUser = messages.image.caption ? messages.image.caption : null;
            mediaType = 'jpeg';
        }

        if (typeMessage == 'video') {
            textUser = messages.video.caption ? messages.video.caption : null;
            mediaType = 'mp4';
        }

        
        // 1. obtener el id del mensaje de imagen
        let idImage = (messages['image'])['id'];
        // 2. Pedir la url del audio en los servidores de Meta
        let url = await MetaAPIMedia.getUrlMedia(idImage);
        // 3. Obtener el binario de la imagen o video
        let binaryMedia = await MetaAPIMedia.getBinaryMedia(url); 
        // 4. procesar la imagen a formato png y enviarlo a google
        let mediaDescription = await google.geminiImageService(binaryMedia, mediaType, textUser, typeMessage);

        mediaDescription = mediaDescription.includes('factura') ? `Quiero facturar, aqui tienes la información \n\n ${mediaDescription}` : `Hola soy Gemini, y aqui te paso la descripción de una imagen que me paso el usuario: \n\n ${mediaDescription}`;

        text = mediaDescription;

    } 
    else {
        text = 'tipo de mensaje no valido';
    }
    //console.log(text);
    return text;
}


module.exports = {
    verifyToken,
    recivedMessage,
}
