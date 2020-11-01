const express = require('express');
require('dotenv').config()
const PORT = process.env.PORT || 4001;
const connectDB = require('./db');

const app = express();
connectDB();

app.use(express.json({ extended: true }));

app.get('/', (req, res) => res.json({ msg: 'Hello world from contact-keeper.' }))

app.use(`/api/users`, require('./routes/users'));
app.use(`/api/auth`, require('./routes/auth'));
app.use(`/api/contacts`, require('./routes/contacts'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));