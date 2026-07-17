const express = require('express');
const router = express.Router();
const {
  createMoto,
  getMotos,
  getMotoById,
} = require('../controllers/motoController');

router.post('/', createMoto);
router.get('/', getMotos);
router.get('/:id', getMotoById);

module.exports = router;