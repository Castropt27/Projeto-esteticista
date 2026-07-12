const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Ocorreu um erro crítico no servidor.' });
});

module.exports = app;