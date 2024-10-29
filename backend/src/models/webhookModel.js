const webhooks = [];

class Webhook {
  constructor(name, enabled, urls) {
    this.name = name;
    this.enabled = enabled;
    this.urls = urls;
  }
}

module.exports = { webhooks, Webhook };
