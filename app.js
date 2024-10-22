const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gestion_productos'
});

connection.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos.');
});

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/categorias', (req, res) => {
    res.sendFile(__dirname + '/categorias.html');
});

app.get('/productos/agrega', (req, res) => {
    res.sendFile(__dirname + '/productos.html');
});

app.get('/productos', (req, res) => {
    connection.query('SELECT p.id, p.nombre, p.precio, c.nombre as categoria FROM productos p JOIN categorias c ON p.categoria_id = c.id', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

app.post('/productos', (req, res) => {
    const { nombre, precio, categoria_id } = req.body;
    connection.query('INSERT INTO productos (nombre, precio, categoria_id) VALUES (?, ?, ?)', [nombre, precio, categoria_id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Producto creado', id: results.insertId });
        }
    });
});

app.put('/productos/:id', (req, res) => {
    const { nombre, precio, categoria_id } = req.body;
    connection.query('UPDATE productos SET nombre = ?, precio = ?, categoria_id = ? WHERE id = ?', [nombre, precio, categoria_id, req.params.id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Producto actualizado' });
        }
    });
});

app.delete('/productos/:id', (req, res) => {
    connection.query('DELETE FROM productos WHERE id = ?', [req.params.id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Producto eliminado' });
        }
    });
});

app.get('/categorias/list', (req, res) => {
    connection.query('SELECT * FROM categorias', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

app.post('/categorias', (req, res) => {
    const { nombre } = req.body;
    connection.query('INSERT INTO categorias (nombre) VALUES (?)', [nombre], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Categoría creada', id: results.insertId });
        }
    });
});

app.put('/categorias/:id', (req, res) => {
    const { nombre } = req.body;
    connection.query('UPDATE categorias SET nombre = ? WHERE id = ?', [nombre, req.params.id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Categoría actualizada' });
        }
    });
});

app.delete('/categorias/:id', (req, res) => {
    connection.query('DELETE FROM categorias WHERE id = ?', [req.params.id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Categoría eliminada' });
        }
    });
});

app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});
