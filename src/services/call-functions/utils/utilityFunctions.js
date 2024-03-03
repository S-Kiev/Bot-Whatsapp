const axios = require('axios');
const { parseISO } = require('date-fns');
const { config } = require('dotenv');

function getTimeOfDay(){
    let date = new Date()
    let hours = date.getHours()
    let timeOfDay = "AM"
    if(hours > 12){
      hours = hours - 12
      timeOfDay = "PM"
    }

	return {
        date: date,
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
        timeOfDay: timeOfDay,
    };
}

function processObj(nameFunction, Obj, objectArguments) {

   if (nameFunction === 'findTotalDebtByCustomerNameAndLastname') {

      if (Array.isArray(Obj.data)) {
          console.log("Obj.data[0] =>" + Obj.data[0]);
          console.log("Obj.data[0].attributes =>" + Obj.data[0].attributes);
          console.log("Obj.data[0].attributes.paid =>" + Obj.data[0].attributes.paid);
      } else {
          console.log("Obj.data no es un array");
      }

      const totalDebt = (Obj.data || []).map(item => {
        console.log(item.attributes);
        console.log(item.attributes.totalCost);
        console.log(item.attributes.paid);

        const totalCost = item.attributes.totalCost || 0;
        const paid = item.attributes.paid || 0;
        return totalCost - paid;
    }).reduce((accumulator, current) => accumulator + current, 0);

      const response = `${objectArguments.name} ${objectArguments.lastname} adeuda un total de ${totalDebt}$ en ${Obj.data.length} deudas.`;

      console.log(response);

      Obj = { response };
  }

  /*
  //Aparentemente strapi acepta que los parametros sean strings => de ser asi esta parte no seria nesesaria
  else if (nameFunction === 'updateMeasurementsCustomer') {

    //parsear a float los argumentos
    Obj.highWaist = !isNaN(parseFloat(Obj.highWaist)) ? parseFloat(Obj.highWaist) : Obj.highWaist;
    Obj.mean = !isNaN(parseFloat(Obj.mean)) ? parseFloat(Obj.mean) : Obj.mean;
    Obj.navelLine = parseFloat(Obj.navelLine) ? parseFloat(Obj.navelLine) :  Obj.navelLine;
    Obj.lowerBelly = parseFloat(Obj.lowerBelly) ? parseFloat(Obj.lowerBelly) : Obj.lowerBelly;
  }
  */

  return Obj;
}

async function sendStickerMessage(number) {
  let data = JSON.stringify({
    "messaging_product": "whatsapp",
    "to": number,
    "type": "sticker",
    "sticker": {
      //Ver un JSON con stikers
      "link": "https://img-09.stickers.cloud/packs/86a1dfad-0e5f-495a-bb2c-430ab11e0416/webp/de25a6ca-9ed3-4f78-8c7c-38bbe185d895.webp"
    }
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://graph.facebook.com/v17.0/146235795241755/messages',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${process.env.WHATSAPP_CLOUD_API_KEY}`
    },
    data : data
  };
  
  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
}

async function strapiRequest(url, method, headers, data) {
  return new Promise((resolve, reject) => {

    let config = {
      method: method,
      maxBodyLength: Infinity,
      url: url,
      headers: headers,
    };

    if ( data !== null ){
      config = {
        ...config,
        data: data
      }
    }

    console.log("data");
    console.log(data);

    axios
      .request(config)
      .then((response) => {
        resolve(JSON.stringify(response.data));
      })
      .catch((error) => {

        if (error.response && error.response.data && error.response.data.message) {
        console.error("Va a resolver"); 

          const message = { 
            message: error.response.data.message,
            status : error.response.status
          };

          resolve(JSON.stringify(message));

        } else {

          const message = { 
            message: 'Ups parece que algo ha salido mal y para ser sincero no se la causa, llama a mis programadores para más información',
            status : error.response ? error.response.status : 'Unknown'
          };

          resolve(JSON.stringify(message));
        }
      });
  });
}


module.exports = {
    getTimeOfDay,
    processObj,
    strapiRequest,
    sendStickerMessage
}