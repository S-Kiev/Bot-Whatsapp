const { OpenAI } = require('openai');


const { functionDictionary } = require('./utils/functionDictionary');
const { processObj, strapiRequest } = require('./utils/utilityFunctions');
const { runFunctionsInSecondCall } = require('./utils/runFunctionsInSecondCall');

const openai = new OpenAI({});


async function runCallFunctions(userText, number) {

  let response = null;

  try {

    response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0613',
      "messages": [
        {
          "role": "system",
          "content": "Tu nombre es Alicia, eres un bot asistente de una clinica estetica-medica que brinda varios tratamientos. Eres muy util y profesional ayudando a los miebros de la clinica a buscar información, actualizarla y agendar consultas"
        },
        {
          "role": "user",
          "content": userText
        }
      ],
      "functions": functionDictionary
    });


    if (response.choices[0].finish_reason === "stop") {
      console.log("Este es el mensaje: ");
      console.log(response.choices[0].message);
      return response.choices[0].message.content;
    }


    const { name: nameFunction, arguments: argumentsFunction } = response.choices[0].message.function_call;
    const parsedArguments = JSON.stringify(argumentsFunction);
    const objectArguments = JSON.parse(argumentsFunction);

    let Obj;
    let url;
    let method = 'get';
    let headers = {};
    let data;

    console.log(response.choices[0].finish_reason);

    //Quiero que identifiques a Juan Perez
    if (nameFunction === 'findCustomerByNameAndLastname') {

      const name = objectArguments.name.replace(/\s/g, "%20");
      const lastname = objectArguments.lastname.replace(/\s/g, "%20");

      url = process.env.STRAPI_BACKEND_HOST + (`/api/customer-personal-informations?filters[name][$eqi]=${name}&filters[lastname][$eqi]=${lastname}`);
    }

    //quiero encontrar al usuario responsable Ezequiel Viera
    else if (nameFunction === 'findConsultationByResponsibleUserName') {

      const name = objectArguments.name.replace(/\s/g, "%20");
      const lastname = objectArguments.lastname.replace(/\s/g, "%20");

      url = process.env.STRAPI_BACKEND_HOST + (`/api/consultations?populate=*&filters[responsibleUser][name][$eqi]=${name}&filters[responsibleUser][lastname][$eqi]=${lastname}&sort[0]=createdAt:desc&pagination[limit]=1`);
    }

    else if (nameFunction === 'findConsultationsByDay') {

      url = process.env.STRAPI_BACKEND_HOST + (`/api/consultation-consulting-rooms?populate[consultation][populate][0]=customer&populate[consultation][populate][1]=responsibleUser&filters[since][$gte]=${objectArguments.dateSince}&filters[since][$lte]=${objectArguments.dateUntil}&filters[consultation][responsibleUser][cellphone][$eq]=${number}`);
    }


    //No funciona aun
    else if (nameFunction === 'findConsultationByCustomerNameAndLastname') {

      const name = objectArguments.name.replace(/\s/g, "%20");
      const lastname = objectArguments.lastname.replace(/\s/g, "%20");

      url = process.env.STRAPI_BACKEND_HOST + (`/api/consultations?populate=*&filters[customer][name][$eqi]=${name}&filters[customer][lastname][$eqi]=${lastname}&sort[0]=createdAt:desc&pagination[limit]=1`);
    }

    //quiero saber como se encunetra el estado de pagos de Emilio Perez
    else if (nameFunction === 'findStatusOfPaymentsOfCustomerByNameAndLastname') {

      const name = objectArguments.name.replace(/\s/g, "%20");
      const lastname = objectArguments.lastname.replace(/\s/g, "%20");

      url = process.env.STRAPI_BACKEND_HOST + (`/api/customer-payments?populate=*&filters[customer][name][$eqi]=${name}&filters[customer][lastname][$eqi]=${lastname}&sort[0]=createdAt:desc&pagination[limit]=1`);
    }

    //quiero saber cuanto debe en total Emilio Perez
    else if (nameFunction === 'findTotalDebtByCustomerNameAndLastname') {

      const name = objectArguments.name.replace(/\s/g, "%20");
      const lastname = objectArguments.lastname.replace(/\s/g, "%20");

      url = process.env.STRAPI_BACKEND_HOST + (`/api/customer-payments?filters[paymentStatus][$eqi]=partial&filters[paymentStatus][$eqi]=pending&filters[customer][name][$eqi]=${name}&filters[customer][lastname][$eqi]=${lastname}`);
    }

    //quiero encontrar el equipo Melashade
    else if (nameFunction === 'findEquitmentByName') {

      const name = objectArguments.name.replace(/\s/g, "%20");

      url = process.env.STRAPI_BACKEND_HOST + (`/api/equipments?populate=*&filters[name][$eqi]=${name}`);
    }

    //quiero saber el estado del equipo melashade
    //Problema => hay 2 melashade en los registros, confunde a GPT
    else if (nameFunction === 'findByStatusEquitmentByName') {

      const name = objectArguments.name.replace(/\s/g, "%20");

      url = process.env.STRAPI_BACKEND_HOST + (`/api/equipment-histories?populate=*&filters[equipment][name][$eqi]=${name}`);
    }

    //quiero saber sobre el tratamiento masajes
    else if (nameFunction === 'findTreatmentsByName') {

      const name = objectArguments.name.replace(/\s/g, "%20");

      url = process.env.STRAPI_BACKEND_HOST + (`/api/treatments?populate=*&filters[name][$eqi]=${name}`);
    }

    //quiero saber sobre el consultorio que es la sala de melashade
    else if (nameFunction === 'findConsultingRoomsByName') {

      const name = objectArguments.name.replace(/\s/g, "%20");

      url = process.env.STRAPI_BACKEND_HOST + (`/api/consulting-rooms?populate=*&filters[name][$eqi]=${name}`);
    }

    //quiero saber sobre el estado del consultorio que es la sala de melashade
    else if (nameFunction === 'findStatusOfConsultingRoomsByName') {

      const name = objectArguments.name.replace(/\s/g, "%20");

      url = process.env.STRAPI_BACKEND_HOST + (`/api/consulting-room-histories?populate=*&filters[consulting_room][name][$eqi]=${name}`);
    }

    //quiero saber sobre la informacion medica de Juan Perez
    else if (nameFunction === 'findMedicalInformationOfCustomerByNameAndLastname') {

      const name = objectArguments.name.replace(/\s/g, "%20");
      const lastname = objectArguments.lastname.replace(/\s/g, "%20");

      url = process.env.STRAPI_BACKEND_HOST + (`/api/customer-medical-informations?populate=*&filters[customer][name][$eqi]=${name}&filters[customer][lastname][$eqi]=${lastname}`);
    }

    //quiero saber sobre la las medidas de Juan Perez
    else if (nameFunction === 'findMeasurementsOfCustomerByNameAndLastname') {

      const name = objectArguments.name.replace(/\s/g, "%20");
      const lastname = objectArguments.lastname.replace(/\s/g, "%20");

      url = process.env.STRAPI_BACKEND_HOST + (`/api/measurements-customers?populate=*&filters[customer][name][$eqi]=${name}&filters[customer][lastname][$eqi]=${lastname}`);
    }

    //quiero que modifiques la informacion de Juan Perez, su documento es 123, su cumpleaños es el 14 de diciembre de 1970, su celular es 098545412, su email es ejemplo@gmail.com, su direccion es calle Uruguay 2020, y su profesion es dermatologo
    else if (nameFunction === 'updateCustomerPersonalInformation') {

      const name = objectArguments.name.replace(/\s/g, "%20");
      const lastname = objectArguments.lastname.replace(/\s/g, "%20");

      url = process.env.STRAPI_BACKEND_HOST + (`/api/customer-personal-informations?filters[name][$eqi]=${name}&filters[lastname][$eqi]=${lastname}`);

      const customerResponse = await strapiRequest(url, method, headers);
      const customer = JSON.parse(customerResponse).data[0];

     if (customer && customer.id) {

        data = {
          data: objectArguments
        }

        url = process.env.STRAPI_BACKEND_HOST + (`/api/customer-personal-informations/${customer.id}`);
        method = 'put';
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`
        };
      } else {
        console.error("Cliente no encontrado o customerId es undefined");
        return;
      }
    }

    //quiero que modifiques el estado de pagos de Juan Perez, este ha abonado la totalida del servicio, pagando 6000 pesos sobre una cuenta de 6000
    else if (nameFunction === 'updatePaymentInformationCustomer') {

      const name = objectArguments.name.replace(/\s/g, "%20");
      const lastname = objectArguments.lastname.replace(/\s/g, "%20");

      url = process.env.STRAPI_BACKEND_HOST + (`/api/customer-payments?populate=*&filters[customer][name][$eqi]=${name}&filters[customer][lastname][$eqi]=${lastname}&sort[0]=createdAt:desc&pagination[limit]=1`);

      const customerResponse = await strapiRequest(url, method, headers);
      const customer = JSON.parse(customerResponse).data[0];


     if (customer && customer.id) {

        data = {
          data: objectArguments
        }

        url = process.env.STRAPI_BACKEND_HOST + (`/api/customer-payments/${customer.id}`);
        method = 'put';
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`
        };
      } else {
        console.error("Cliente no encontrado o customerId es undefined");
        return;
      }
    }

    //quiero que modifiques los datos medicos de Juan Perez, este consume perifar 400 como medicacion, su numero de mergencia es 095646464, su doctor es Ejemplencio Rodriguez y no tiene problemas de hipertencion
    else if (nameFunction === 'updateMedicalInformationCustomer') {

      const name = objectArguments.name.replace(/\s/g, "%20");
      const lastname = objectArguments.lastname.replace(/\s/g, "%20");

      url = process.env.STRAPI_BACKEND_HOST + (`/api/customer-medical-informations?populate=*&filters[customer][name][$eqi]=${name}&filters[customer][lastname][$eqi]=${lastname}`);

      const customerResponse = await strapiRequest(url, method, headers);
      const customer = JSON.parse(customerResponse).data[0];

      console.log("Id del cliente =>" + customer.id);
      if (customer && customer.id) {

        data = {
          data: objectArguments
        }


        url = process.env.STRAPI_BACKEND_HOST + (`/api/customer-medical-informations/${customer.id}`);
        method = 'put';
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`
        };
      } else {
        console.error("Cliente no encontrado o customerId es undefined");
        return;
      }
    }

    //quiero que modifiques las medidas de Juan Perez, este tiene un alto de cintura de 60cm, mide 1 metro con 70 centimetros, y tiene un vientre bajo de 70 centimetros
    else if (nameFunction === 'updateMeasurementsCustomer') {

      const name = objectArguments.name.replace(/\s/g, "%20");
      const lastname = objectArguments.lastname.replace(/\s/g, "%20");

      url = process.env.STRAPI_BACKEND_HOST + (`/api/measurements-customers?populate=*&filters[customer][name][$eqi]=${name}&filters[customer][lastname][$eqi]=${lastname}`);

      const customerResponse = await strapiRequest(url, method, headers);
      const customer = JSON.parse(customerResponse).data[0];

     if (customer && customer.id) {

        data = {
          data: objectArguments
        }

        url = process.env.STRAPI_BACKEND_HOST + (`/api/measurements-customers/${customer.id}`);
        method = 'put';
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`
        };
      } else {
        console.error("Cliente no encontrado o customerId es undefined");
        return;
      }
    }

    // CREATE
    //quiero que agendes una consulta para Emilio Perez para el 20 de diciembre de 14 a 16 horas, se realizaran estos tratamientos: masajes y Lo que haga el melashade ("Lo que haga el melashade" es el nombre del tratamiento). eN Sala de Melashade
    else if (nameFunction === 'botCreate') {
      //VER SI POST REQUIERE DE ALGUNA OTRA CONFIGURACION
      data = {
        userNumber: number,
        ...objectArguments
      };
      url = process.env.STRAPI_BACKEND_HOST + ('/api/consultation/botCreate');
      method = 'post';
      headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`
      };
    }

    //quiero que canceles la consulta de Emilio Perez del 6 de diciembre
    else if (nameFunction === 'cancelConsultation'){

      data = {
        userNumber: number,
        ...objectArguments
      };

      url = process.env.STRAPI_BACKEND_HOST + ('/api/consultation/cancelConsultation');
      method = 'put';
      headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`
      };
    }

    else if (nameFunction === 'createPaymentWithGemini'){

      data = {
        data: objectArguments
      };
      url = process.env.STRAPI_BACKEND_HOST + ('/api/customer-payments');
      method = 'post';
      headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`
      };
    }


    // Despues de hacer las configuraciones nesesarias de axios segun cada call function llamar a Strapi segun el metodo

    if (method === 'get') {

      try {
        Obj = await strapiRequest(url, method, headers);
      } catch (error) {
        console.error("Error al obtener el objeto:", error);
      }

    }

    else if (method === 'put') {

      try {
        Obj = await strapiRequest(url, method, headers, data);
      } catch (error) {
        console.error("Error al actualizar el objeto:", error);
      }

    }


    else if (method === 'post'){
      try {
        Obj  = await strapiRequest(url, method, headers, data);
      } catch (error) {
        console.error("Error al crear la consulta:", error);
      }

    }


    //PROCESS OBJ
    // Solo para hacer la sumatoria de la deuda total del cliente
    Obj = processObj(nameFunction, JSON.parse(Obj), objectArguments);

    if (Obj === undefined) {
      Obj = {
        message: `No se pudo recuperar los datos de la base de datos`
      };
    }

    try {
      const response = await runFunctionsInSecondCall(userText, argumentsFunction, nameFunction, Obj);
      return response;
    } catch (error) {
      console.error("Error al obtener el objeto:", error);
    }
  } catch (error) {
    console.error("Error al comunicarse con la API de OpenAI:", error);
    return null;
  }

}


module.exports = {
  runCallFunctions
}
