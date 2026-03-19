const express = require('express');
const db = require('./database');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('Server starting...');

app.post('/api/simpan-login', (req, res) => {
    console.log('POST /api/simpan-login received');
    console.log('Body:', req.body);
    const username = req.body.username;
    const password = req.body.password;
    
    db.run('INSERT INTO users (username, password, status) VALUES (?, ?, ?)',
        [username, password, 'Aktif'],
        function(err) {
            if (err) {
                console.log('Error:', err);
                res.status(500).json({ success: false, message: 'Error!' });
            } else {
                console.log('Success!');
                res.json({ success: true });
            }
        }
    );
});

app.get('/api/users', (req, res) => {
    db.all('SELECT * FROM users ORDER BY id DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

app.get('/api/pencairan', (req, res) => {
    db.all('SELECT * FROM pencairan ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

app.post('/api/pencairan', (req, res) => {
    const { nama, alamat, no_hp, jumlah_pencairan } = req.body;
    
    db.run('INSERT INTO pencairan (nama, alamat, no_hp, jumlah_pencairan) VALUES (?, ?, ?, ?)',
        [nama, alamat, no_hp, jumlah_pencairan],
        function(err) {
            if (err) {
                res.status(500).json({ success: false, message: 'Error!' });
            } else {
                res.json({ success: true, id: this.lastID });
            }
        }
    );
});

app.post('/api/users', (req, res) => {
    const { username, password } = req.body;
    
    db.run('INSERT INTO users (username, password, status) VALUES (?, ?, ?)',
        [username, password, 'Aktif'],
        function(err) {
            if (err) {
                res.status(500).json({ success: false, message: 'Error!' });
            } else {
                res.json({ success: true, id: this.lastID });
            }
        }
    );
});

app.delete('/api/pencairan/:id', (req, res) => {
    db.run('DELETE FROM pencairan WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ success: false });
        } else {
            res.json({ success: true });
        }
    });
});

app.delete('/api/users/:id', (req, res) => {
    db.run('DELETE FROM users WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ success: false });
        } else {
            res.json({ success: true });
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/formulir', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'formulir.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'style.css'));
});

app.get('/FB.png', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'FB.png'));
});

app.get('/FONT%20FB.png', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'FONT FB.png'));
});

app.listen(PORT, () => {
    console.log('Server started on http://localhost:' + PORT);
});
