const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/test', (req, res) => {
    console.log('POST /test called');
    console.log('Body:', req.body);
    res.json({ success: true, body: req.body });
});

app.get('/test', (req, res) => {
    console.log('GET /test called');
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log('Test server started on http://localhost:' + PORT);
});
