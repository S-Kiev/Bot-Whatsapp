const { chatWithPDFs } = require('./chatWithPDF');


async function main() {  
        const response = await chatWithPDFs('Como te llamas? Quien es la dueña de la clinica? en que servicios se especializa?');

        console.log(response);
}

main();