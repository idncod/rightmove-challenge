const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const app = express();

app.use(cors());

app.use (express.json());

app.use(routes);

const PORT = 'https://rightmove-challenge.onrender.com' || 3000;
app.listen(PORT, () => {
    console.log(`Listening on: localhost:${PORT}`);
});
