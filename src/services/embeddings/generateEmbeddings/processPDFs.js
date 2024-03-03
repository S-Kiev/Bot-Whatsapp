const path = require('path');
const { splitTextIntoChunks } = require('./splitTextIntoChunks');
const { generateRandomTableName } = require('./generateRandomTableName');
const { saveEmbeddingsSQLite } = require('./saveEmbeddingsSQLite');

// npm install pdf.js-extract
const { PDFExtract } = require('pdf.js-extract');



const processPDFs = async () =>{

    try {

        //Cambair aqui los PDFs
    const pdfFilePath = path.join(__dirname, '../PDFs/SaludEnergiaNatural.pdf');

    const pdfExtract = new PDFExtract();

    const extractOptions = {
        firstPage: 1,
        lastPage: undefined,
        password: '',
        verbosity: -1,
        normalizeWhitespace: false,
        disableCombinedTextItems: false
      }
        
    const data = await pdfExtract.extract(pdfFilePath, extractOptions);
    
    const pdfText = data.pages.map(page => page.content.map(item => item.str).join(' ')).join(' ');
    
        // Realiza cualquier acción adicional con el texto extraído del PDF

    //if there is no text extracted return an error
    if (pdfText.length === 0) {
        console.error('El PDF debe tener contenido:', error);
        return;
    }

    // Split the PDF text into chunks
    const chunks = splitTextIntoChunks(pdfText);


        //generate a random table name of 10 characters.
        const table_name = 'embaddings'
        //generateRandomTableName();
    
        //calculate embeddings of the chunks and store them inside a table
    await saveEmbeddingsSQLite(chunks, table_name);

        // Return a JSON response with the table name and original name of the pdf file
    return { table_name, filename: 'SaludEnergiaNatural.pdf'}

    } catch (error) {
        console.error('Error al procesar el PDF:', error);
    }

}

//Ejecutar este archivo para generar la BD
processPDFs();