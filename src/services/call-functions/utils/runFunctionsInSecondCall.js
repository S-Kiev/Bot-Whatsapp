const { OpenAI } = require('openai');
const openai = new OpenAI({});
const { functionDictionary } = require('./functionDictionary');

async function runFunctionsInSecondCall (userText, argumentsFunction, nameFunction, Obj) {

    console.log("Llego a la segunda llamada");

    
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-0613',
            "messages": [
                {
                    "role": "system",
                    "content": "Tu nombre es Alicia, eres un bot asistente de una clinica estetica-medica que brinda varios tratamientos. Eres muy util y profesional ayudando a los miebros de la clinica a buscar información, actualizarla y agendar consultas"
                },
                {
                    "role": "user", 
                    "content": userText
                },
                {
                    "role": "assistant",
                    "content": null,
                    "function_call": {
                        "name": nameFunction,
                        "arguments": argumentsFunction
                    }
                },
                {
                  "role": "function",
                  "name" : nameFunction,
                  "content": JSON.stringify(Obj),
                }
              ],
              "functions": functionDictionary
        });
    
    
        console.log(response);
    
        if(response.choices[0].finish_reason === "stop") {
            console.log(response.choices[0].message.content)
            return response.choices[0].message.content;
        } else {
          return `Ups parace que algo ha salido mal al llamar a la funcion: ${nameFunction}`;
        }
    
    }

module.exports = {
    runFunctionsInSecondCall
}