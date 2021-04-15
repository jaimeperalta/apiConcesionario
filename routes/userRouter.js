'use strict'

const express = require('express');
const router = express.Router();
const cors = require('cors');
const userController = require("../controllers/users/userController");

router.use(express.json());
router.use(express.urlencoded({
  extended: false
}))
router.use(cors());
router.post('/create',userController.crear)
router.post('/login',userController.login)

module.exports = router;