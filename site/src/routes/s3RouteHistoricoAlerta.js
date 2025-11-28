const express = require('express');
const router = express.Router();
const path = require('path');

const s3Controller = require('../controllers/s3ControllerHistoricoAlerta');

// router.get('/dados/:arquivo', (req, res) => {
//   s3Controller.lerArquivo(req, res);
// });

// router.get('/ver/:arquivo', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../public', 'dashboard_historico_disco.html'));
// });

// router.get('/ver/ultimo', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../public', 'dashboard_historico_disco.html'));
// });

router.get('/dados/ultimo', (req, res) => {
  s3Controller.lerUltimoArquivo(req, res);
});

module.exports = router;