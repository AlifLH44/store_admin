const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    db.query('SELECT produk.id, nama_produk, harga, jumlah FROM produk JOIN stock ON produk.id = stock.produk_id', (err, produk) => {
        if(err) throw err;
        res.render('index', { produk });
    });
});

app.get('/pembelian', (req, res) => {
    db.query('SELECT * FROM produk', (err, produk) => {
        if(err) throw err;
        res.render('pembelian', { produk });
    });
});

app.post('/pembelian', (req, res) => {
    const { produk_id, jumlah } = req.body;
    db.query('SELECT harga, jumlah AS stock FROM produk JOIN stock ON produk.id = stock.produk_id WHERE produk.id = ?', [produk_id], (err, result) => {
        if(err) throw err;
        if(result.length > 0 && result[0].stock >= jumlah){
            const total_harga = result[0].harga * jumlah;
            db.query('INSERT INTO pembelian (produk_id, jumlah, total_harga) VALUES (?,?,?)', [produk_id, jumlah, total_harga], (err2) => {
                if(err2) throw err2;
                db.query('UPDATE stock SET jumlah = jumlah - ? WHERE produk_id = ?', [jumlah, produk_id], (err3) => {
                    if(err3) throw err3;
                    res.redirect('/');
                });
            });
        } else {
            res.send('Stock tidak cukup!');
        }
    });
});

app.get('/cancel/:id', (req, res) => {
    const pembelian_id = req.params.id;
    db.query('SELECT * FROM pembelian WHERE id = ? AND status="active"', [pembelian_id], (err, result) => {
        if(err) throw err;
        if(result.length > 0){
            const produk_id = result[0].produk_id;
            const jumlah = result[0].jumlah;
            db.query('UPDATE pembelian SET status="cancel" WHERE id=?', [pembelian_id], (err2) => {
                if(err2) throw err2;
                db.query('UPDATE stock SET jumlah = jumlah + ? WHERE produk_id=?', [jumlah, produk_id], (err3) => {
                    if(err3) throw err3;
                    res.redirect('/');
                });
            });
        } else {
            res.send('Pembelian tidak ditemukan atau sudah dibatalkan.');
        }
    });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
