const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('✓ Database connected successfully');
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            status TEXT DEFAULT 'Aktif',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS pencairan (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nama TEXT NOT NULL,
            alamat TEXT NOT NULL,
            no_hp TEXT NOT NULL,
            jumlah_pencairan TEXT NOT NULL,
            status TEXT DEFAULT 'Pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    const checkUser = db.prepare('SELECT COUNT(*) as count FROM users WHERE username = ?');
    checkUser.get('admin', (err, row) => {
        if (row.count === 0) {
            db.run('INSERT INTO users (username, password, status) VALUES (?, ?, ?)', 
                ['admin', 'admin123', 'Admin'], 
                (err) => {
                    if (!err) console.log('✓ Default admin user created (username: admin, password: admin123)');
                }
            );
        }
    });
});

module.exports = db;
