const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function runCompletion(text, context) {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: "system", content: `Te llamas Hermes y eres un ayudante muy util que proporciona información basándose en el siguiente texto (pero no menciones que te basaste en el para responder): ${context}` },
            { role: "user", content: text },
        ],
        temperature: 1,
        max_tokens: 400,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    return response;
}

module.exports ={
    runCompletion
}