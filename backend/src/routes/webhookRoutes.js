const express = require('express');
const {
  createWebhook,
  getWebhooks,
  updateWebhook,
  deleteWebhook,
  triggerWebhook,
} = require('../controllers/webhookController');

const router = express.Router();

router.post('/', createWebhook);
router.get('/', getWebhooks);
router.put('/:id', updateWebhook);
router.delete('/:id', deleteWebhook);
router.post('/trigger/:id', triggerWebhook);

module.exports = router;
