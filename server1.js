const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 8000;

const app = express();
connectDB();

app.use(express.json({ extended: true }));

app.use(`/api/users`, require('./routes/users'));
app.use(`/api/auth`, require('./routes/auth'));
app.use(`/api/contacts`, require('./routes/contacts'));

// Server static assets in production.
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    )
}

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));