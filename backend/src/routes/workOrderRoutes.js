const express = require('express');
const router = express.Router();
const {
  createWorkOrder,
  updateWorkOrderStatus,
  getWorkOrders,
  getWorkOrderById,
} = require('../controllers/workOrderController');
const { addItem, deleteItem } = require('../controllers/itemController');

router.post('/', createWorkOrder);
router.get('/', getWorkOrders);
router.get('/:id', getWorkOrderById);
router.patch('/:id/status', updateWorkOrderStatus);
router.post('/:id/items', addItem);
router.delete('/items/:itemId', deleteItem);

module.exports = router;