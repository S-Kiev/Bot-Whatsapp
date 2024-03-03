function messageText(textResponse, number) {
    const data = JSON.stringify(
        {
            "messaging_product": "whatsapp",    
            "to": number,
            "text": {
                "preview_url": true,
                "body": textResponse
            },
            "type": "text"
        }
    );

    return data;
};

function messageList(number) {
    
    const data = JSON.stringify(
        {
            "messaging_product": "whatsapp",    
            "to": number,
            "type": "interactive",
            "interactive": {
                "type": "list",
                "body": {
                    "text": "Puedo ofrecerte estas opciones"
                },
                "footer": {
                    "text": "Selecciona una de estas opciones para poder atenderte"
                },
                "action": {
                    "button": "Ver Opciones",
                    "sections": [
                        {
                            "title": "Selecciona Tratamiento",
                            "rows": [
                                {
                                    "id": "main-reserva 1",
                                    "title": "Comprar",
                                    "description": "Liftin Facial"
                                },
                                {
                                    "id": "main-reserva2",
                                    "title": "Llamar",
                                    "description": "Contactanos"
                                }
                            ]
                        },
                        {
                            "title": "Atencion",
                            "rows": [
                                {
                                    "id": "local",
                                    "title": "Local",
                                    "description": "Pregunta por nuestra ubicacion"
                                },
                                {
                                    "id": "telefono",
                                    "title": "Telefono",
                                    "description": "Puedes contactarnos aqui"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    );

    return data;
};

function messageButtons(number) {

    const data = JSON.stringify(
        {
            "messaging_product": "whatsapp",    
            "to": number,
            "type": "interactive",
            "interactive": {
                "type": "button",
                "body": {
                    "text": "¿Confirmas tu registro?"
                },
                "action": {
                    "buttons": [
                        {
                            "type": "reply",
                            "reply": {
                                "id": "option-Si",
                                "title": "SI"
                            }
                        },
                        {
                            "type": "reply",
                            "reply": {
                                "id": "option-No",
                                "title": "NO"
                            }
                        }
                    ]
                }
            }
        }
    );

    return data;
};

function messageLocation(number) {
    
    const data = JSON.stringify(
        {
            "messaging_product": "whatsapp",    
            "to": number,
            "type" : "location",
            "location": {
                "latitude" : "-31.38305038184244",
                "longitude" : "-57.9584507028279",
                "name": "Salud y Estetica Natural",
                "address": "Av Armando I. Barbieri 1242, 50000 Salto, Departamento de Salto"
            }
        }
    );

    return data;
};

module.exports = {
    messageText,
    messageList,
    messageButtons,
    messageLocation,
};