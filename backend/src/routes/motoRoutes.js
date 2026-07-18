const express = require('express');
const router = express.Router();
const {
  createMoto,
  getMotos,
  getMotoById,
} = require('../controllers/motoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, createMoto);
router.get('/', authMiddleware, getMotos);
router.get('/:id', authMiddleware, getMotoById);

module.exports = router;