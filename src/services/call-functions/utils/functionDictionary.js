const functionDictionary = [
  {
      "name": "getTimeOfDay",
      "description": "Brindar al usuario la hora",
      "parameters": {
          "type": "object",
          "properties": {
          },
          "require": [],
      }
  },
  {
    "name": "findCustomerByNameAndLastname",
    "description": "Identificar a un cliente por su nombre y apellido",
    "parameters": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Es el nombre del cliente"
        },
        "lastname": {
          "type": "string",
          "description": "Es el apellido del cliente"
        }
      },
      "required": ["name", "lastname"]
    }
  },
  {
    "name": "findConsultationByCustomerNameAndLastname",
    "description": "encontrar una consulta por el nombre y apellido de un cliente",
    "parameters": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Es el nombre del cliente"
        },
        "lastname": {
          "type": "string",
          "description": "Es el apellido del cliente"
        }
      },
      "required": ["name", "lastname"]
    }
  },
  {
    "name": "findEquitmentByName",
    "description": "El usuario te pedira que encuentres un equipo (maquinas e implementos usados en tratamientos cosmetologicos-salud) por el nombre del equipo. Ejemplo Melashade",
    "parameters": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Es el nombre del equipo"
        }
      },
      "required": ["name"]
    }
  },
  {
    "name": "findByStatusEquitmentByName",
    "description": "El usuario te consultara por el nombre de un equipo (maquinas e implementos usados en tratamientos cosmetologicos-salud) su estado. Los estados son enums con valores en ingles (ejemplo availible para disponible), tu siempre dale el estado en español",
    "parameters": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Es el nombre del equipo"
        }
      },
      "required": ["name"]
    }
  },
  {
    "name": "findTreatmentsByName",
    "description": "El usuario te consultara por un tratamiento a travez del nombre del mismo. Ejemplo Masajes, liposupcion, etc",
    "parameters": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Es el nombre del tratamineto"
        }
      },
      "required": ["name"]
    }
  },
  {
    "name": "findConsultingRoomsByName",
    "description": "El usuario te consultara por un consultorio a travez del nombre del mismo. Ejemplo: Sala de Masajes",
    "parameters": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Es el nombre del consultorio"
        }
      },
      "required": ["name"]
    }
  },
  {
    "name": "findStatusOfConsultingRoomsByName",
    "description": "El usuario te consultara por el estado de un consultorio a travez del nombre del mismo. Los estados son enums con valores en ingles (ejemplo availible para disponible), tu siempre dale el estado en español",
    "parameters": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Es el nombre del consultorio"
        }
      },
      "required": ["name"]
    }
  },
  {
    "name": "findStatusOfPaymentsOfCustomerByNameAndLastname",
    "description": "El usuario te consultara por el estado de los pagos de un cliente. Puede preguntarte cuanto debe pagar, cuanto ha pagado o cual es el estado de ese pago",
    "parameters": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Es el nombre del cliente"
        },
        "lastname": {
          "type": "string",
          "description": "Es el apellido del cliente"
        }
      },
      "required": ["name", "lastname"]
    }
  },
  {
    "name": "findTotalDebtByCustomerNameAndLastname",
    "description": "El usuario te consultara por la deuda total de un cliente.",
    "parameters": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Es el nombre del cliente"
        },
        "lastname": {
          "type": "string",
          "description": "Es el apellido del cliente"
        }
      },
      "required": ["name", "lastname"]
    }
  },
  {
    "name": "findMedicalInformationOfCustomerByNameAndLastname",
    "description": "El usuario te consultara por la informacion medica de un cliente. Puede preguntarte por el Telefono de emergencia, si el paciente tiene cancer, problemas de columna o de corazon, etc.",
    "parameters": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Es el nombre del cliente"
        },
        "lastname": {
          "type": "string",
          "description": "Es el apellido del cliente"
        }
      },
      "required": ["name", "lastname"]
    }
  },
  {
    "name": "findMeasurementsOfCustomerByNameAndLastname",
    "description": "El usuario te consultara por la las medidas de un cliente.",
    "parameters": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Es el nombre del cliente"
        },
        "lastname": {
          "type": "string",
          "description": "Es el apellido del cliente"
        }
      },
      "required": ["name", "lastname"]
    }
  },    
  {
    "name": "findConsultationsByDay",
    "description": `El usuario te pedira encontrar las consultas de un dia particular, ten encuenta que puede referirse al dia de ayer, hoy, mañana o a una fecha especifica; aqui tienes la fecha actual: ${new Date}`,
    "parameters": {
      "type": "object",
      "properties": {
        "dateSince": {
          "type": "string",
          "description": `el inicio del dia simpre sera desde las 00:00:00, si el usuario te dice "la consulta del 6 de diciembre de 2023" este es el resultado esperado: "2023-12-06T00:00:00Z". El usuario puede referirse al dia de mañana, dentro de 3 dias, la semana proxima; para deducir cuando seria aqui tienes la fecha actual como contexto: ${new Date()}`,
        },
        "dateUntil": {
          "type": "string",
          "description": `el final del dia simpre sera las 23:59:59, si el usuario te dice "la consulta del 6 de diciembre de 2023" este es el resultado esperado: "2023-12-06T23:59:59Z". El usuario puede referirse al dia de mañana, dentro de 3 dias, la semana proxima; para deducir cuando seria aqui tienes la fecha actual como contexto: ${new Date()}`,
        }
      },
      "required": ["dateSince", "dateUntil"]
    }
  },
  {
    "name": "updateCustomerPersonalInformation",
    "description": "El usuario te pedira que modifiques la información personal de un cliente",
    "parameters": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Es el nombre del cliente"
        },
        "lastname": {
          "type": "string",
          "description": "Es el apellido del cliente"
        },
        "document": {
          "type": "string",
          "description": "Es el documanto de identificacion del cliente. Ejemplo 46581259"
        },
        "birthdate": {
          "type": "string",
          "description": `Es el cumpleaños del cliente. Debes establecerlo en este formato (datetime): 'AAAA-MM-DDTHH:MM:SS'. Si el ususario no te da indicaciones de minutos o segundos pon 00. Aqui tienes la fecha actual como contexto: ${new Date()}`
        },
        "cellphone": {
          "type": "string",
          "description": "Es el celular del cliente. recuerda que el usuario te brindara un numero como 098454550, pero debes guardarlo como 59898454550. Elimina el primer 0 y agregale al inicio 598"
        },
        "email": {
          "type": "string",
          "description": "Es el correo electronico del cliente."
        },
        "address": {
          "type": "string",
          "description": "Es la dirección del cliente. Donde vive, calle y numero"
        },
        "howDidYouKnow": {
          "type": "string",
          "description": "Es el medio por el cual el cliente conocio la clinica. Por ejemplo redes sociales, boca a boca (recomendacion de alguien), publicidad, etc."
        },
        "profession": {
          "type": "string",
          "description": "Es la profesion del cliente, es decir a que se dedica. ejemplo doctor, albañil, enfermero, etc."
        },
        "reasonFirstVisit": {
          "type": "string",
          "description": "Es la razon por la cual el cliente visito la clinica por primera vez."
        }
      },
      "required": ["name", "lastname"]
    }
  },
  {
    "name": "updatePaymentInformationCustomer",
    "description": "El usuario te pedira que modifiques la información de pagos de un cliente",
    "parameters": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Es el nombre del cliente"
        },
        "lastname": {
          "type": "string",
          "description": "Es el apellido del cliente"
        },
        "totalCost": {
          "type": "integer",
          "description": "Es el costo total por la consumicion del cliente"
        },
        "paid": {
          "type": "integer",
          "description": "Es lo que ha pagado el cliente"
        },
        "paymentStatus": {
          "type": "string",
          "enum": ["total", "partial", "pending"],
          "description": "Es el estado de pagos del cliente, el usuario te lo dira en español. es un enum con valores posibles: total (cuando se ha pagado el total de la cuenta), partial (cuando es pacial y no se ha abonado el 100%) y pending (cuando esta pendiente porque el cliente ha abonado 0)"
        }
      },
      "required": ["name", "lastname"]
    }
  },
  {
    "name": "updateMedicalInformationCustomer",
    "description": "El usuario te pedira que modifiques los datos medicos de un cliente",
    "parameters": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Es el nombre del cliente"
        },
        "lastname": {
          "type": "string",
          "description": "Es el apellido del cliente"
        },
        "medication": {
          "type": "string",
          "description": "Son los medicamentos que consume el cliente"
        },
        "doctor": {
          "type": "string",
          "description": "Es el doctor que atinede al cliente"
        },
        "emergencyPhone": {
          "type": "string",
          "description": "Es el telefono de emergencia del cliente. Si el usuario te brindara un numero como 098454550, es un numero de celular pero debes guardarlo como 59898454550. Elimina el primer 0 y agregale al inicio 598"
        },
        "suffersIllness": {
          "type": "string",
          "description": "Son las enefermedades particulares que sufre el cliente"
        },
        "columnProblem": {
          "type": "boolean",
          "description": "Si el usuario padece o no de problemas de columna"
        },
        "operation": {
          "type": "string",
          "description": "Son las operaciones que ha tenido el paciente"
        },
        "heartProblem": {
          "type": "boolean",
          "description": "Si el usuario padece o no de problemas de corazon"
        },
        "cancer": {
          "type": "string",
          "description": "Es un detalle sobre el tipo de cancer que padece el paciente"
        },
        "diu": {
          "type": "boolean",
          "description": "DIU es la sigle de Dispositivo intrauterino, en este campo hay que determinar si el paciente tiene o no DIU"
        },
        "metalImplants": {
          "type": "boolean",
          "description": "En este campo hay que determinar si el paciente tiene o no Implantes Metalicos"
        },
        "hypertensive": {
          "type": "boolean",
          "description": "En este campo hay que determinar si el paciente tiene o no Hipertencion"
        },
        "varicoseVeins": {
          "type": "boolean",
          "description": "En este campo hay que determinar si el paciente tiene o no Varices"
        },
        "coagulationProblems": {
          "type": "boolean",
          "description": "En este campo hay que determinar si el paciente tiene o no problemas de coagulación de sangre"
        },
        "comments": {
          "type": "string",
          "description": "Son comentarios u observaciones adicionales"
        }
      },
      "required": ["name", "lastname"]
    }
  },    
  {
    "name": "updateMeasurementsCustomer",
    "description": "El usuario te pedira que modifiques datos relacionados a las medidas de un cliente",
    "parameters": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Es el nombre del cliente"
        },
        "lastname": {
          "type": "string",
          "description": "Es el apellido del cliente"
        },
        "highWaist": {
          "type": "string",
          "description": "es el alto de la ciuntura de el cliente. Debes expresarlo en metros con dos cifras despues de un punto; por ejemplo un metro y medio serian 1.50, u 80 centrimetros serian 0.80. Es importante mantener este formato pues este string sera parseado a float posteriormente"
        },
        "mean": {
          "type": "string",
          "description": "Es la media del cliente. Debes expresarlo en metros con dos cifras despues de un punto; por ejemplo un metro y medio serian 1.50, u 80 centrimetros serian 0.80. Es importante mantener este formato pues este string sera parseado a float posteriormente"
        },
        "navelLine": {
          "type": "string",
          "description": "Es la linea del ombligo del cliente. Debes expresarlo en metros con dos cifras despues de un punto; por ejemplo un metro y medio serian 1.50, u 80 centrimetros serian 0.80. Es importante mantener este formato pues este string sera parseado a float posteriormente"
        },
        "lowerBelly": {
          "type": "string",
          "description": "Es la medida del vientre bajo del cliente. Debes expresarlo en metros con dos cifras despues de un punto; por ejemplo un metro y medio serian 1.50, u 80 centrimetros serian 0.80. Es importante mantener este formato pues este string sera parseado a float posteriormente"
        }
      },
      "required": ["name", "lastname"]
    }
  },    
  {
    "name": "botCreate",
    "description": "El usuario te pedira que crees (o agendes) una consulta para un cliente",
    "parameters": {
      "type": "object",
      "properties": {
        "customerName": {
          "type": "string",
          "description": "Es el nombre del cliente"
        },
        "customerLastname": {
          "type": "string",
          "description": "Es el apellido del cliente"
        },
        "dateSince": {
          "type": "string",
          "description": `es el momento que comienza la consulta. Debes establecerlo en este formato (datetime): 'AAAA-MM-DDTHH:MM:SS'. Si el ususario no te da indicaciones de minutos o segundos pon 00. Si no te da indicacion de dia que sea el dia de hoy. Aqui tienes la fecha actual como contexto: ${new Date()}`,
        },
        "dateUntil": {
          "type": "string",
          "description": `es el momento que finaliza la consulta. Debes establecerlo en este formato (datetime): 'AAAA-MM-DDTHH:MM:SS'. Si el ususario no te da indicaciones de minutos o segundos pon 00. Si no te da indicacion de dia que sea el dia de hoy. Aqui tienes la fecha actual como contexto: ${new Date()}`,
        },
        "treatments": {
          "type": "array",
          "description": "son los nombres de los tratamientos, como en una consulta un cliente puede solicitar mas de un tratamiento nesecito que me los agrupes como un array con sus nombres",
          "items": {
            "type": "string"
          }
        },
        "consultingRoomName": {
          "type": "string",
          "description": "Es el nombre del consultorio en el cual se agendara la consulta"
        }
      },
      "required": ["customerName", "customerLastname", "dateSince", "dateUntil", "treatments", "consultingRoomName"]
    }
  },    
  {
    "name": "cancelConsultation",
    "description": "El usuario te pedira cancelar una consulta para un cliente",
    "parameters": {
      "type": "object",
      "properties": {
        "customerName": {
          "type": "string",
          "description": "Es el nombre del cliente"
        },
        "customerLastname": {
          "type": "string",
          "description": "Es el apellido del cliente"
        },
        "dateSince": {
          "type": "string",
          "description": `el inicio del dia simpre sera desde las 00:00:00, si el usuario te dice "la consulta del 6 de diciembre de 2023" este es el resultado esperado: "2023-12-06T00:00:00Z". El usuario puede referirse al dia de mañana, dentro de 3 dias, la semana proxima; para deducir cuando seria aqui tienes la fecha actual como contexto: ${new Date()}`,
        },
        "dateUntil": {
          "type": "string",
          "description": `el final del dia simpre sera las 23:59:59, si el usuario te dice "la consulta del 6 de diciembre de 2023" este es el resultado esperado: "2023-12-06T23:59:59Z". El usuario puede referirse al dia de mañana, dentro de 3 dias, la semana proxima; para deducir cuando seria aqui tienes la fecha actual como contexto: ${new Date()}`,
        }
      },
      "required": ["customerName", "customerLastname", "dateSince", "dateUntil"]
    }
  },    
  {
    "name": "createPaymentWithGemini",
    "description": "El usuario o Gemini te dira que necesita creear una factura",
    "parameters": {
      "type": "object",
      "properties": {
        "consultation": {
          "type": "number",
          "description": "Es el id/número de la consulta"
        },
        "customer": {
          "type": "number",
          "description": "Es el id/número del cliente"
        },
        "totalCost": {
          "type": "number",
          "description": "Es el costo total de la factura"
        },
        "paid": {
          "type": "number",
          "description": "Es el monto abonado/pagado por el cliente"
        },
        "paymentStatus": {
          "type": "string",
          "enum": ["total", "partial", "pending"],
          "description": "Es el estado de pagos de la factura, el usuario te lo dira en español. es un enum con valores posibles: total (cuando se ha pagado el total de la factura), partial (cuando es pacial y no se ha abonado el 100%) y pending (cuando esta pendiente porque el cliente ha abonado 0)"
        }
      },
      "required": ["consultation", "customer", "totalCost", "paid", "paymentStatus"]
    }
  }
]

module.exports = {
  functionDictionary
}