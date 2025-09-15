const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

let items = [];
let nextId = 1;

app.get('/', (req, res) => {
  res.json({ message: 'Hello from AWS CI/CD pipeline' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/items', (req, res) => {
  res.json(items);
});

app.post('/api/items', (req, res) => {
  const item = { id: nextId++, ...req.body };
  items.push(item);
  res.status(201).json(item);
});

app.put('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });
  items[index] = { id, ...req.body };
  res.json(items[index]);
});

app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });
  items.splice(index, 1);
  res.status(204).send();
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;