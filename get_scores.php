<?php
// Sertakan file koneksi database
include 'db_config.php';

// Cek apakah ada permintaan ekspor ke CSV
$export_csv = isset($_GET['export']) && $_GET['export'] === 'true';

if ($export_csv) {
    // Header untuk unduh file CSV
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=rekap_nilai_pencernaan_smp.csv');

    $output = fopen('php://output', 'w');
    // Tulis header kolom CSV
    fputcsv($output, ['ID', 'Nama Siswa', 'Kelas', 'Total Permainan', 'Jumlah Soal', 'Jawaban Benar', 'Jawaban Salah', 'Persentase (%)', 'Total Poin', 'Level Tertinggi', 'Lencana', 'Kategori', 'Tanggal']);

    // Ambil data dari database
    $query = "SELECT * FROM hasil_siswa ORDER BY tanggal DESC";
    $result = $conn->query($query);

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            fputcsv($output, [
                $row['id'],
                $row['nama_siswa'],
                $row['kelas'],
                $row['total_permainan'],
                $row['jumlah_soal'],
                $row['jawaban_benar'],
                $row['jawaban_salah'],
                $row['persentase'],
                $row['total_poin'],
                $row['level_tertinggi'],
                $row['lencana'],
                $row['kategori'],
                $row['tanggal']
            ]);
        }
    }
    fclose($output);
    exit();
}

// Jika bukan ekspor CSV, kembalikan data dalam format JSON untuk Dashboard Guru
header('Content-Type: application/json');

$query = "SELECT * FROM hasil_siswa ORDER BY tanggal DESC";
$result = $conn->query($query);

$data_siswa = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data_siswa[] = $row;
    }
}

echo json_encode([
    "status" => "success",
    "data" => $data_siswa
]);

$conn->close();
?>