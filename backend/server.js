const express = require('express');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'entregaya-api', status: 'running' });
});

app.get('/', (req, res) => {
  res.json({ message: 'EntregaYa API ready' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('EntregaYa backend running on port', PORT);
});
