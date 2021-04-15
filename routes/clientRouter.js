'use strict'

const express = require('express');
const router = express.Router();
const cors = require('cors');
const clientController = require("../controllers/clients/clientController");
const md_auth = require("../middlewares/auth");

router.use(express.json());
router.use(express.urlencoded({
  extended: false
}))
router.use(cors());
router.post('/crear',md_auth.ensureAuth,clientController.crear)
router.post('/editar',md_auth.ensureAuth,clientController.editar)
router.post('/eliminar',md_auth.ensureAuth,clientController.eliminar)
router.post('/listar',md_auth.ensureAuth,clientController.listar)
router.post('/buscar',md_auth.ensureAuth,clientController.buscar)
router.post('/reporte',md_auth.ensureAuth,clientController.reporte)

module.exports = router;