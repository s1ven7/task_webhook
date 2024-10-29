import React, { useEffect, useState } from 'react';
import { Form, Input, Button, List, Switch, message } from 'antd';
import axios from 'axios';

const App = () => {
  const [webhooks, setWebhooks] = useState([]);
  const [form] = Form.useForm();

  const fetchWebhooks = async () => {
    const response = await axios.get('/webhooks');
    setWebhooks(response.data);
  };

  const createWebhook = async (values) => {
    const { name, enabled, urls } = values;
    await axios.post('/webhooks', { name, enabled, urls: urls.split(',').map(url => url.trim()) });
    message.success('Webhook created successfully');
    form.resetFields();
    fetchWebhooks();
  };

  const triggerWebhook = async (id) => {
    const data = prompt('Enter data attributes (JSON format):');
    if (data) {
      await axios.post(`/webhooks/trigger/${id}`, JSON.parse(data));
      message.success('triggered successfully');
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Webhook Manager</h1>
      <Form form={form} onFinish={createWebhook} layout="vertical">
        <Form.Item name="name" label="Webhook Name" rules={[{ required: true }]}>
          <Input placeholder="Enter webhook name" />
        </Form.Item>
        <Form.Item name="enabled" label="Enabled" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="urls" label="URLs" rules={[{ required: true }]}>
          <Input.TextArea placeholder="Enter URLs (comma separated)" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Create Webhook</Button>
        </Form.Item>
      </Form>
      <h2>Created Webhooks</h2>
      <List
        bordered
        dataSource={webhooks}
        renderItem={(item, index) => (
          <List.Item
            actions={[<Button onClick={() => triggerWebhook(index)}>Trigger</Button>]}
          >
            {item.name} - {item.enabled ? 'Enabled' : 'Disabled'}
          </List.Item>
        )}
      />
    </div>
  );
};

export default App;
