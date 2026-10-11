<?php
// Sertakan file koneksi database
include 'db_config.php';

// Atur header agar menerima data JSON
header('Content-Type: application/json');

// Periksa apakah request menggunakan metode POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Ambil data JSON yang dikirimkan oleh frontend
    $inputData = json_decode(file_get_contents('php://input'), true);

    if ($inputData) {
        $nama_siswa       = $conn->real_escape_string($inputData['nama_siswa'] ?? 'Tanpa Nama');
        $kelas            = $conn->real_escape_string($inputData['kelas'] ?? 'Tanpa Kelas');
        $total_permainan  = intval($inputData['total_permainan'] ?? 0);
        $jumlah_soal      = intval($inputData['jumlah_soal'] ?? 0);
        $jawaban_benar    = intval($inputData['jawaban_benar'] ?? 0);
        $jawaban_salah    = intval($inputData['jawaban_salah'] ?? 0);
        $persentase       = floatval($inputData['persentase'] ?? 0.00);
        $total_poin       = intval($inputData['total_poin'] ?? 0);
        $level_tertinggi  = $conn->real_escape_string($inputData['level_tertinggi'] ?? '-');
        $lencana          = $conn->real_escape_string(is_array($inputData['lencana']) ? implode(', ', $inputData['lencana']) : ($inputData['lencana'] ?? '-'));
        $kategori         = $conn->real_escape_string($inputData['kategori'] ?? '-');

        // Query untuk menyimpan data ke tabel hasil_siswa
        $sql = "INSERT INTO hasil_siswa (nama_siswa, kelas, total_permainan, jumlah_soal, jawaban_benar, jawaban_salah, persentase, total_poin, level_tertinggi, lencana, kategori) 
                VALUES ('$nama_siswa', '$kelas', $total_permainan, $jumlah_soal, $jawaban_benar, $jawaban_salah, $persentase, $total_poin, '$level_tertinggi', '$lencana', '$kategori')";

        if ($conn->query($sql) === TRUE) {
            echo json_encode([
                "status" => "success", 
                "message" => "Nilai dan hasil belajar siswa berhasil disimpan ke database!"
            ]);
        } else {
            echo json_encode([
                "status" => "error", 
                "message" => "Gagal menyimpan ke database: " . $conn->error
            ]);
        }
    } else {
        echo json_encode([
            "status" => "error", 
            "message" => "Data JSON tidak valid atau kosong."
        ]);
    }
} else {
    echo json_encode([
        "status" => "error", 
        "message" => "Metode request tidak diizinkan."
    ]);
}

// Tutup koneksi database
$conn->close();
?>