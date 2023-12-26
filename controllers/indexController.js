var express = require('express')
var router = express.Router()

const indexService = require('../services/indexService');

router.get('/', indexService.index);

module.exports = router