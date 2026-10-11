<?php
// Konfigurasi Database MySQL
$host = "localhost";
$username = "root";
$password = "";
$database = "db_pencernaan_smp";

// Membuat koneksi menggunakan MySQLi
$conn = new mysqli($host, $username, $password, $database);

// Periksa koneksi
if ($conn->connect_error) {
    die("Koneksi ke database gagal: " . $conn->connect_error);
}

// Set karakter utf8mb4 agar mendukung emoji dan teks khusus
$conn->set_charset("utf8mb4");
?>