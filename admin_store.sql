CREATE DATABASE IF NOT EXISTS admin_store;
USE admin_store;

CREATE TABLE IF NOT EXISTS produk (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_produk VARCHAR(100),
    harga DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produk_id INT,
    jumlah INT,
    FOREIGN KEY (produk_id) REFERENCES produk(id)
);

CREATE TABLE IF NOT EXISTS pembelian (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produk_id INT,
    jumlah INT,
    total_harga DECIMAL(10,2),
    status ENUM('active','cancel') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produk_id) REFERENCES produk(id)
);

INSERT INTO produk (nama_produk, harga) VALUES
('Produk A', 10000),
('Produk B', 15000),
('Produk C', 20000),
('Produk D', 12000),
('Produk E', 18000),
('Produk F', 25000),
('Produk G', 30000),
('Produk H', 22000),
('Produk I', 27000),
('Produk J', 35000);

INSERT INTO stock (produk_id, jumlah) VALUES
(1,50),(2,50),(3,50),(4,50),(5,50),
(6,50),(7,50),(8,50),(9,50),(10,50);
