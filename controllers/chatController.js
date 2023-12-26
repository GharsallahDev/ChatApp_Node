var express = require("express")
var router = express.Router()

const chatService = require('../services/chatService');

router.get('/', chatService.showMessages)

router.post('/save-message', chatService.saveMessage);


module.exports = router