const dotenv = require('dotenv');
dotenv.config();
const https = require('https');


function sendMessageWhatsapp(data) {

    const options = {
        host: 'graph.facebook.com',
        path: '/v17.0/146235795241755/messages',
        method: 'POST',
        body: data,
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${process.env.WHATSAPP_CLOUD_API_KEY}`
        }
    };

    const req = https.request(options, res=>{
        res.on('data', d=>{
            process.stdout.write(d);
        })
    });

    req.on('error', error=>{
        console.error(error);
    });

    req.write(data);
    req.end();
}

module.exports = {
    sendMessageWhatsapp
};
