const whatsappModel = require('../shared/whatsappModels');
const whatsappService = require('../services/whatsappService');

const chatGPT_Service = require('../services/chatGPT-Service');
const { queryPineconeAndQueryGPT } = require('../services/embeddings/langchain/PineCone/queryPineconeAndQueryGPT');
const { runCallFunctions } = require('../services/call-functions/callChatGPTWithFunctions');

const { strapiRequest } = require('../services/call-functions/utils/utilityFunctions');
const { sendStickerMessage } = require('../services/call-functions/utils/utilityFunctions')


async function processMessage(textUser, number) {

    textUser = textUser.toLowerCase();
    var models = [];

    const cellphoneResponsibleUsers = await strapiRequest(process.env.RESPONSIBLE_USERS_CELLPHONE_URL , 'get', {});

    console.log("cellphoneResponsibleUsers => ");
    console.log(cellphoneResponsibleUsers);
    console.log("cellphoneResponsibleUsers.includes(number) => ");
    console.log(cellphoneResponsibleUsers.includes(number));

    //Solo los numeros de las colaboradoras podran acceder al asistente virtual
    if (cellphoneResponsibleUsers.includes(number)) {
        console.log("Estas autorizado");

        // "pregunta" es la palabra clave para ingresar al flujo de los embeddings
        if (textUser.includes('pregunta')){

            const resultChatGPTWithEmbeddings = await queryPineconeAndQueryGPT(textUser);
    
            if(resultChatGPTWithEmbeddings != null){
                var model = whatsappModel.messageText(resultChatGPTWithEmbeddings, number);
                models.push(model);
            }
            else {
                var model = whatsappModel.messageText("Lo siento pero parece que algo ha salido mal, intentalo mas tarde", number);
                models.push(model);
            }
    
        // "quiero" es la palabra clave para ingresar al flujo de las call funtions
        } else if (textUser.includes('quiero')){
    
            const resultChatGPTWithFunctions = await runCallFunctions(textUser, number);
    
            console.log(resultChatGPTWithFunctions);
            
            if(resultChatGPTWithFunctions != null){
                var model = whatsappModel.messageText(resultChatGPTWithFunctions, number);
                models.push(model);
            }
            else {
                var model = whatsappModel.messageText("Lo siento pero parece que algo ha salido mal, intentalo mas tarde", number);
                models.push(model);
            }
            
        } else {
            
            const resultChatGPT = await chatGPT_Service.getMessageChatGPT(textUser);
    
            if(resultChatGPT != null){
                var model = whatsappModel.messageText(resultChatGPT, number);
                models.push(model);
            }
            else {
                var model = whatsappModel.messageText("Lo siento pero parece que algo ha salido mal, intentalo mas tarde", number);
                models.push(model);
            }
        }

    } else {
        await sendStickerMessage(number);
        var model = whatsappModel.messageText("Lo siento pero no estas autorizado a interactuar con el Bot", number);
        models.push(model);
    }

    //#region MODELO BASICO DE BOT SIN IA
    /*
    if (textUser.includes('hola')) {
        var model = whatsappModel.messageText('hola, como estas?', number);
        models.push(model);
    }
    else if (textUser.includes('gracias')){
        var model = whatsappModel.messageText('gracias a ti!', number);
        models.push(model);
    }
    else if (textUser.includes('adios') || textUser.includes('chau') || textUser.includes('bye')){
        var model = whatsappModel.messageText('Adios que tengas un gran dia!', number);
        models.push(model);
    }
    else if (textUser.includes('llamar')){
        var model = whatsappModel.messageText('contactalas en: https://santumar.com/', number);
        models.push(model);
    }
    else if (textUser.includes('local')){
        var model = whatsappModel.messageLocation(number);
        models.push(model);
    }
    else if (textUser.includes('telefono')){
        var model = whatsappModel.messageText('*Llamanos al:*\n45266258',number);
        models.push(model);
    }
    else {
        var model = whatsappModel.messageText('Disculpa pero no entiendo lo que dices', number);
        models.push(model);
    }
    //#endregion
    */
    //#region CON 

    
    //#endregion
    models.forEach(model => {
        whatsappService.sendMessageWhatsapp(model);        
    });
};

module.exports = {
    processMessage
};