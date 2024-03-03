const express = require('express');
const router = express.Router();
const whatsAppController = require('../controllers/whatsappControllers');

router
      .get('/', whatsAppController.verifyToken)
      .post('/', whatsAppController.recivedMessage);

module.exports = router;