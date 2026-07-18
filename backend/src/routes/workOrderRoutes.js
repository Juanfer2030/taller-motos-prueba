const express = require('express');
const router = express.Router();
const {
  createWorkOrder,
  updateWorkOrderStatus,
  getWorkOrders,
  getWorkOrderById,
  getWorkOrderHistory,
} = require('../controllers/workOrderController');
const { addItem, deleteItem } = require('../controllers/itemController');
const authMiddleware = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

router.post('/', authMiddleware, createWorkOrder);
router.get('/', authMiddleware, getWorkOrders);
router.get('/:id', authMiddleware, getWorkOrderById);
router.get('/:id/history', authMiddleware, getWorkOrderHistory);
router.patch('/:id/status', authMiddleware, updateWorkOrderStatus);
router.post('/:id/items', authMiddleware, addItem);
router.delete('/items/:itemId', authMiddleware, requireRole('ADMIN'), deleteItem);

module.exports = router;