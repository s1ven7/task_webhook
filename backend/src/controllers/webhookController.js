const { webhooks, Webhook } = require('../models/webhookModel');
const axios = require('axios');

const createWebhook = (req, res) => {
  const { name, enabled, urls } = req.body;
  const webhook = new Webhook(name, enabled, urls);
  webhooks.push(webhook);
  res.status(201).json(webhook);
};

const getWebhooks = (req, res) => {
  res.json(webhooks);
};

const updateWebhook = (req, res) => {
  const { id } = req.params;
  const { name, enabled, urls } = req.body;
  const webhook = webhooks[id];

  if (webhook) {
    webhook.name = name;
    webhook.enabled = enabled;
    webhook.urls = urls;
    res.json(webhook);
  } else {
    res.status(404).send('Webhook not found');
  }
};

const deleteWebhook = (req, res) => {
  const { id } = req.params;
  if (webhooks[id]) {
    webhooks.splice(id, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Webhook not found');
  }
};

const triggerWebhook = async (req, res) => {
  const { id } = req.params;
  const webhook = webhooks[id];

  if (webhook && webhook.enabled) {
    const data = req.body;
    const promises = webhook.urls.map(url => {
      const finalUrl = url.replace(/\{\{(.*?)\}\}/g, (_, key) => data[key.trim()]);
      return axios.post(finalUrl, data);
    });

    await Promise.all(promises);
    res.send('Webhook triggered');
  } else {
    res.status(404).send('Webhook not found or disabled');
  }
};

module.exports = {
  createWebhook,
  getWebhooks,
  updateWebhook,
  deleteWebhook,
  triggerWebhook,
};
