// Konfigurasi Klien Supabase
const SUPABASE_URL = 'https://kuampqsjfbnlhxqjafpu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1YW1wcXNqZmJubGh4cWphZnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2NTY3NjIsImV4cCI6MjEwNzIzMjc2Mn0.iIE82fRLSy8vmRF0kCEGoNlXhyYemO3_zcOR1hzR69U';

// Inisialisasi Klien Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// VARIABEL GLOBAL GAME
let gameState = {
    namaSiswa: "",
    kelasSiswa: "",
    totalPoin: 0,
    totalPermainanSelesai: 0,
    jumlahSoalDijawab: 0,
    jawabanBenar: 0,
    jawabanSalah: 0,
    levelTertinggi: "Penjelajah Organ (Level 1)",
    lencanaDiperoleh: [],
    audioAktif: true
};

// Efek Suara Sederhana menggunakan Audio Context Web API
function playSound(type) {
    if (!gameState.audioAktif) return;
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'success') {
            osc.frequency.setValueAtTime(440, audioCtx.currentTime);
            osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
        } else if (type === 'error') {
            osc.frequency.setValueAtTime(200, audioCtx.currentTime);
            osc.frequency.setValueAtTime(150, audioCtx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
        } else if (type === 'click') {
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        }
    } catch (e) {
        console.log("Audio browser tidak didukung secara otomatis.");
    }
}

function toggleAudio() {
    gameState.audioAktif = !gameState.audioAktif;
    const icon = document.getElementById("audio-icon");
    if (gameState.audioAktif) {
        icon.className = "fas fa-volume-up text-primary";
        playSound('click');
    } else {
        icon.className = "fas fa-volume-mute text-danger";
    }
}

// NAVIGASI HALAMAN
function switchPage(pageId) {
    document.querySelectorAll('.game-page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function mulaiPetualangan() {
    const nama = document.getElementById("input-nama").value.trim();
    const kelas = document.getElementById("input-kelas").value.trim();

    if (!nama || !kelas) {
        alert("Mohon isi Nama Lengkap dan Kelas Anda terlebih dahulu sebelum memulai petualangan!");
        return;
    }

    gameState.namaSiswa = nama;
    gameState.kelasSiswa = kelas;

    document.getElementById("display-nama").innerText = nama;
    document.getElementById("display-kelas").innerText = kelas;
    document.querySelectorAll(".nama-siswa-teks").forEach(el => el.innerText = nama);

    playSound('success');
    switchPage('page-map');
}

function kembaliKeMenu() {
    playSound('click');
    switchPage('page-map');
    updatePoinUI();
}

function kembaliKeHome() {
    playSound('click');
    switchPage('page-home');
}

function bukaMenuMateri() {
    playSound('click');
    switchPage('page-materi');
}

function bukaPetunjuk() {
    playSound('click');
    const myModal = new bootstrap.Modal(document.getElementById('modalPetunjuk'));
    myModal.show();
}

function updatePoinUI() {
    document.getElementById("display-poin").innerText = gameState.totalPoin;
}

function tambahPoin(jumlah, namaLencana = null) {
    gameState.totalPoin += jumlah;
    updatePoinUI();
    playSound('success');
    if (namaLencana && !gameState.lencanaDiperoleh.includes(namaLencana)) {
        gameState.lencanaDiperoleh.push(namaLencana);
        alert(`🎉 Luar Biasa! Kamu mendapatkan lencana baru: "${namaLencana}"!`);
    }
}

// PEMICU MINIGAME (1 s.d 7)
function mulaiGame(nomorGame) {
    playSound('click');
    switchPage('page-game');
    const container = document.getElementById("game-container-body");
    const titleEl = document.getElementById("game-title");
    document.getElementById("current-game-score").innerText = gameState.totalPoin;

    if (nomorGame === 1) {
        titleEl.innerText = "Game 1: Rangkai Jalur Makanan";
        muatGameRangkaiOrgan(container);
    } else if (nomorGame === 2) {
        titleEl.innerText = "Game 2: Body Explorer";
        muatGameBodyExplorer(container);
    } else if (nomorGame === 3) {
        titleEl.innerText = "Game 3: Pasukan Enzim";
        muatGameEnzim(container);
    } else if (nomorGame === 4) {
        titleEl.innerText = "Game 4: Sebutir Nasi Menjelajah";
        muatGameSebutirNasi(container);
    } else if (nomorGame === 5) {
        titleEl.innerText = "Game 5: Ilmuwan Cilik";
        muatGameIlmuwanCilik(container);
    } else if (nomorGame === 6) {
        titleEl.innerText = "Game 6: Tantangan Pintar IPA (Kuis)";
        muatGameKuis(container);
    } else if (nomorGame === 7) {
        titleEl.innerText = "Game 7: Pahlawan Pencernaan";
        muatGamePahlawan(container);
    }
}

// ==========================================
// GAME 1: RANGKAI JALUR MAKANAN
// ==========================================
function muatGameRangkaiOrgan(container) {
    const urutanBenar = ["Mulut", "Faring", "Kerongkongan", "Lambung", "Usus Halus", "Usus Besar", "Rektum", "Anus"];
    let kartuAcak = [...urutanBenar].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <div class="alert alert-primary d-flex align-items-center">
            <i class="fas fa-robot fa-2x me-3"></i>
            <div><strong>DIGO berkata:</strong> Susun kartu organ pencernaan di bawah ini dari urutan pertama makanan masuk hingga keluar melalui anus!</div>
        </div>
        <div id="sortable-list" class="row g-2 mb-3">
            ${kartuAcak.map((org, idx) => `
                <div class="col-md-3 col-6">
                    <div class="card p-3 text-center fw-bold bg-light border shadow-sm draggable-card" draggable="true" data-org="${org}">
                        <i class="fas fa-grip-vertical text-muted mb-1"></i> ${org}
                    </div>
                </div>
            `).join('')}
        </div>
        <button class="btn btn-success fw-bold px-4 rounded-pill" onclick="periksaUrutanOrgan()">Periksa Jawaban</button>
        <div id="hasil-game1" class="mt-3"></div>
    `;

    let cards = container.querySelectorAll('.draggable-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            container.querySelector('#sortable-list').appendChild(card);
            playSound('click');
        });
    });
}

function periksaUrutanOrgan() {
    const urutanBenar = ["Mulut", "Faring", "Kerongkongan", "Lambung", "Usus Halus", "Usus Besar", "Rektum", "Anus"];
    const kartuCards = document.querySelectorAll('#sortable-list .draggable-card');
    let susunanSiswa = Array.from(kartuCards).map(c => c.getAttribute('data-org'));

    let benarSemua = true;
    for (let i = 0; i < urutanBenar.length; i++) {
        if (susunanSiswa[i] !== urutanBenar[i]) {
            benarSemua = false;
            break;
        }
    }

    gameState.jumlahSoalDijawab++;
    const divHasil = document.getElementById("hasil-game1");

    if (benarSemua) {
        gameState.jawabanBenar++;
        tambahPoin(50, "Lencana Ahli Organ");
        gameState.totalPermainanSelesai = Math.max(gameState.totalPermainanSelesai, 1);
        gameState.levelTertinggi = "Ahli Enzim (Level 2)";
        divHasil.innerHTML = `<div class="alert alert-success"><i class="fas fa-check-circle me-2"></i><strong>Hebat!</strong> Urutan organ pencernaan sudah 100% benar! Kamu mendapatkan 50 poin.</div>`;
    } else {
        gameState.jawabanSalah++;
        playSound('error');
        divHasil.innerHTML = `<div class="alert alert-warning"><i class="fas fa-exclamation-triangle me-2"></i><strong>Belum tepat!</strong> DIGO memberi petunjuk: Mulut -> Faring -> Kerongkongan -> Lambung -> Usus Halus -> Usus Besar -> Rektum -> Anus. Coba susun kembali!</div>`;
    }
    document.getElementById("current-game-score").innerText = gameState.totalPoin;
}

// ==========================================
// GAME 2: BODY EXPLORER
// ==========================================
function muatGameBodyExplorer(container) {
    const misiList = [
        { soal: "Tempat makanan pertama kali masuk dan dikunyah oleh gigi?", jawaban: "Mulut" },
        { soal: "Organ yang mendorong makanan menuju lambung dengan gerak peristaltik?", jawaban: "Kerongkongan" },
        { soal: "Organ yang mengaduk makanan dengan asam lambung dan enzim pepsin?", jawaban: "Lambung" },
        { soal: "Tempat utama pencernaan kimiawi lanjutan & penyerapan sari makanan?", jawaban: "Usus Halus" },
        { soal: "Organ yang menyerap sisa air dan elektrolit serta membentuk feses?", jawaban: "Usus Besar" },
        { soal: "Organ yang menghasilkan cairan empedu untuk mengemulsikan lemak?", jawaban: "Hati" },
        { soal: "Organ yang menghasilkan enzim pencernaan dan cairan bikarbonat?", jawaban: "Pankreas" }
    ];

    window.bodyMisiIndex = 0;
    window.bodyMisiList = misiList;

    renderMisiBodyExplorer(container);
}

function renderMisiBodyExplorer(container) {
    let misi = window.bodyMisiList[window.bodyMisiIndex];
    const pilihanOrgan = ["Mulut", "Kerongkongan", "Lambung", "Usus Halus", "Usus Besar", "Hati", "Pankreas", "Rektum", "Anus"];

    container.innerHTML = `
        <div class="alert alert-info d-flex align-items-center">
            <i class="fas fa-robot fa-2x me-3"></i>
            <div><strong>Misi Body Explorer (${window.bodyMisiIndex + 1}/${window.bodyMisiList.length}):</strong><br>${misi.soal}</div>
        </div>
        <div class="row g-2 mb-3">
            ${pilihanOrgan.map(org => `
                <div class="col-md-4 col-6">
                    <button class="btn btn-outline-primary w-100 py-3 fw-bold rounded-3 shadow-sm" onclick="jawabBodyExplorer('${org}')">${org}</button>
                </div>
            `).join('')}
        </div>
        <div id="hasil-body"></div>
    `;
}

function jawabBodyExplorer(pilihan) {
    let misi = window.bodyMisiList[window.bodyMisiIndex];
    gameState.jumlahSoalDijawab++;
    const divHasil = document.getElementById("hasil-body");

    if (pilihan === misi.jawaban) {
        gameState.jawabanBenar++;
        tambahPoin(20);
        divHasil.innerHTML = `<div class="alert alert-success mt-2">Benar sekali! Itu adalah organ <strong>${misi.jawaban}</strong>.</div>`;
        setTimeout(() => {
            window.bodyMisiIndex++;
            if (window.bodyMisiIndex < window.bodyMisiList.length) {
                renderMisiBodyExplorer(document.getElementById("game-container-body"));
            } else {
                gameState.totalPermainanSelesai = Math.max(gameState.totalPermainanSelesai, 2);
                tambahPoin(40, "Lencana Penjelajah Tubuh");
                document.getElementById("game-container-body").innerHTML = `
                    <div class="text-center py-4">
                        <div class="display-1 text-success mb-3"><i class="fas fa-check-circle"></i></div>
                        <h3 class="fw-bold text-dark">Misi Body Explorer Selesai!</h3>
                        <p class="text-muted">Kamu berhasil mengenali seluruh lokasi organ pencernaan dengan tepat.</p>
                        <button class="btn btn-primary rounded-pill px-4 fw-bold" onclick="kembaliKeMenu()">Kembali ke Peta Misi</button>
                    </div>
                `;
            }
        }, 1200);
    } else {
        gameState.jawabanSalah++;
        playSound('error');
        divHasil.innerHTML = `<div class="alert alert-danger mt-2">Kurang tepat. DIGO: Coba ingat kembali fungsi organ pencernaan!</div>`;
    }
    document.getElementById("current-game-score").innerText = gameState.totalPoin;
}

// ==========================================
// GAME 3: PASUKAN ENZIM
// ==========================================
function muatGameEnzim(container) {
    const pasanganEnzim = [
        { enzim: "Amilase", zat: "Pati / Amilum", tempat: "Mulut" },
        { enzim: "Pepsin", zat: "Protein", tempat: "Lambung" },
        { enzim: "Lipase", zat: "Lemak", tempat: "Usus Halus / Pankreas" },
        { enzim: "Tripsin", zat: "Protein / Pepton", tempat: "Usus Halus" }
    ];

    container.innerHTML = `
        <div class="alert alert-warning d-flex align-items-center">
            <i class="fas fa-robot fa-2x me-3"></i>
            <div><strong>DIGO berkata:</strong> Cocokkan enzim pencernaan dengan zat makanan yang dicernanya dengan benar!</div>
        </div>
        <div class="row g-3">
            ${pasanganEnzim.map((item, idx) => `
                <div class="col-md-6">
                    <div class="p-3 bg-light rounded-3 border shadow-sm">
                        <h5 class="fw-bold text-primary"><i class="fas fa-flask me-1"></i> Enzim: ${item.enzim}</h5>
                        <p class="small text-muted mb-2">Bekerja di: <strong>${item.tempat}</strong></p>
                        <label class="form-label small fw-bold">Pilih Zat Makanan yang Dicerna:</label>
                        <select class="form-select select-enzim" data-benar="${item.zat}">
                            <option value="">-- Pilih Zat Makanan --</option>
                            <option value="Pati / Amilum">Pati / Amilum</option>
                            <option value="Protein">Protein</option>
                            <option value="Lemak">Lemak</option>
                            <option value="Protein / Pepton">Protein / Pepton</option>
                            <option value="Vitamin C">Vitamin C</option>
                        </select>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="mt-4 text-center">
            <button class="btn btn-success fw-bold px-5 rounded-pill" onclick="periksaGameEnzim()">Periksa Jawaban Enzim</button>
        </div>
        <div id="hasil-enzim" class="mt-3"></div>
    `;
}

function periksaGameEnzim() {
    const selects = document.querySelectorAll('.select-enzim');
    let totalDikerjakan = selects.length;
    let benarCount = 0;

    selects.forEach(sel => {
        gameState.jumlahSoalDijawab++;
        if (sel.value === sel.getAttribute('data-benar')) {
            benarCount++;
            gameState.jawabanBenar++;
        } else {
            gameState.jawabanSalah++;
        }
    });

    const divHasil = document.getElementById("hasil-enzim");
    if (benarCount === totalDikerjakan) {
        tambahPoin(60, "Lencana Komandan Enzim");
        gameState.totalPermainanSelesai = Math.max(gameState.totalPermainanSelesai, 3);
        gameState.levelTertinggi = "Peneliti Pencernaan (Level 3)";
        divHasil.innerHTML = `<div class="alert alert-success"><strong>Luar Biasa!</strong> Semua pasangan enzim dan zat makanan benar (${benarCount}/${totalDikerjakan})! +60 Poin.</div>`;
    } else {
        playSound('error');
        divHasil.innerHTML = `<div class="alert alert-warning">Kamu menjawab benar ${benarCount} dari ${totalDikerjakan} soal enzim. Periksa kembali materi enzim pencernaan!</div>`;
    }
    document.getElementById("current-game-score").innerText = gameState.totalPoin;
}

// ==========================================
// GAME 4: SEBUTIR NASI MENJELAJAH
// ==========================================
function muatGameSebutirNasi(container) {
    window.nasiStep = 0;
    window.nasiPertanyaan = [
        {
            organ: "1. MULUT",
            narasi: "Sebutir nasi masuk ke dalam mulut dan mulai dikunyah oleh gigi serta dibasahi air liur.",
            tanya: "Proses apa yang terjadi pada nasi di dalam mulut?",
            pilihan: [
                "A. Pencernaan mekanis oleh gigi dan awal pencernaan kimiawi pati oleh amilase",
                "B. Penyerapan seluruh sari makanan ke dalam darah",
                "C. Pembentukan feses padat"
            ],
            jawaban: 0
        },
        {
            organ: "2. KERONGKONGAN",
            narasi: "Nasi yang telah dikunyah terdorong ke faring dan masuk ke kerongkongan.",
            tanya: "Bagaimana cara dinding kerongkongan mendorong makanan menuju lambung?",
            pilihan: [
                "A. Dengan tiupan udara dari paru-paru",
                "B. Melalui gerak peristaltik (kontraksi otot meremas)",
                "C. Dengan gaya gravitasi bumi saja tanpa otot"
            ],
            jawaban: 1
        },
        {
            organ: "3. LAMBUNG",
            narasi: "Nasi tiba di lambung dan diaduk bersama cairan asam lambung serta enzim pepsin.",
            tanya: "Apa fungsi utama asam lambung (HCl) selain membantu enzim pepsin?",
            pilihan: [
                "A. Membunuh kuman dan mikroorganisme yang masuk bersama makanan",
                "B. Memberikan rasa manis pada makanan",
                "C. Mengubah lemak menjadi vitamin"
            ],
            jawaban: 0
        },
        {
            organ: "4. USUS HALUS",
            narasi: "Bubur makanan (kimus) mengalir ke usus halus untuk pencernaan lanjutan dan penyerapan.",
            tanya: "Di manakah tempat utama penyerapan sebagian besar zat gizi makanan berlangsung?",
            pilihan: [
                "A. Usus Besar",
                "B. Lambung",
                "C. Usus Halus (melalui vili / jonjot usus)"
            ],
            jawaban: 2
        }
    ];

    renderSebutirNasi(container);
}

function renderSebutirNasi(container) {
    let step = window.nasiStep;
    let data = window.nasiPertanyaan[step];

    container.innerHTML = `
        <div class="alert alert-danger d-flex align-items-center">
            <i class="fas fa-utensils fa-2x me-3"></i>
            <div><strong>Simulasi Sebutir Nasi (${data.organ}):</strong><br>${data.narasi}</div>
        </div>
        <h5 class="fw-bold text-dark mb-3">${data.tanya}</h5>
        <div class="d-grid gap-2 mb-3">
            ${data.pilihan.map((pil, idx) => `
                <button class="btn btn-outline-primary text-start p-3 fw-bold rounded-3" onclick="jawabSebutirNasi(${idx})">${pil}</button>
            `).join('')}
        </div>
        <div id="hasil-nasi"></div>
    `;
}

function jawabSebutirNasi(pilihanSiswa) {
    let step = window.nasiStep;
    let data = window.nasiPertanyaan[step];
    gameState.jumlahSoalDijawab++;
    const divHasil = document.getElementById("hasil-nasi");

    if (pilihanSiswa === data.jawaban) {
        gameState.jawabanBenar++;
        tambahPoin(25);
        divHasil.innerHTML = `<div class="alert alert-success">Benar! Perjalanan nasi berlanjut ke tahap berikutnya.</div>`;
        setTimeout(() => {
            window.nasiStep++;
            if (window.nasiStep < window.nasiPertanyaan.length) {
                renderSebutirNasi(document.getElementById("game-container-body"));
            } else {
                gameState.totalPermainanSelesai = Math.max(gameState.totalPermainanSelesai, 4);
                tambahPoin(50, "Lencana Ilmuwan Cilik");
                document.getElementById("game-container-body").innerHTML = `
                    <div class="text-center py-4">
                        <div class="display-1 text-success mb-3"><i class="fas fa-flag-checkered"></i></div>
                        <h3 class="fw-bold text-dark">Simulasi Sebutir Nasi Selesai!</h3>
                        <p class="text-muted">Kamu berhasil mengikuti perjalanan sebutir nasi dari mulut hingga diserap tubuh.</p>
                        <button class="btn btn-primary rounded-pill px-4 fw-bold" onclick="kembaliKeMenu()">Kembali ke Peta Misi</button>
                    </div>
                `;
            }
        }, 1200);
    } else {
        gameState.jawabanSalah++;
        playSound('error');
        divHasil.innerHTML = `<div class="alert alert-danger">Belum tepat. DIGO: Perhatikan kembali konsep materi organ tersebut!</div>`;
    }
    document.getElementById("current-game-score").innerText = gameState.totalPoin;
}

// ==========================================
// GAME 5: LABORATORIUM PENCERNAAN
// ==========================================
function muatGameIlmuwanCilik(container) {
    container.innerHTML = `
        <div class="alert alert-info d-flex align-items-center">
            <i class="fas fa-atom fa-2x me-3"></i>
            <div><strong>Laboratorium Pencernaan:</strong> Simulasi perbandingan luas permukaan makanan yang dikunyah halus vs potongan besar.</div>
        </div>
        <div class="row g-3 mb-4">
            <div class="col-md-6">
                <div class="card p-3 border shadow-sm bg-light">
                    <h5 class="fw-bold text-danger">Sampel A: Potongan Besar</h5>
                    <p class="small text-muted mb-0">Makanan ditelan dalam ukuran besar tanpa dikunyah matang.</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card p-3 border shadow-sm bg-light">
                    <h5 class="fw-bold text-success">Sampel B: Kunyahan Halus</h5>
                    <p class="small text-muted mb-0">Makanan dikunyah sangat lembut dan bercampur air liur.</p>
                </div>
            </div>
        </div>
        <h5 class="fw-bold text-dark">Mengapa makanan perlu dikunyah sampai halus di dalam mulut?</h5>
        <div class="d-grid gap-2 mb-3">
            <button class="btn btn-outline-primary text-start p-3 fw-bold rounded-3" onclick="jawabLab(false)">A. Agar makanan cepat membusuk di lambung</button>
            <button class="btn btn-outline-primary text-start p-3 fw-bold rounded-3" onclick="jawabLab(true)">B. Memperluas permukaan kontak makanan agar enzim pencernaan bekerja lebih cepat dan efektif</button>
            <button class="btn btn-outline-primary text-start p-3 fw-bold rounded-3" onclick="jawabLab(false)">C. Agar lambung tidak perlu bekerja sama sekali</button>
        </div>
        <div id="hasil-lab"></div>
    `;
}

function jawabLab(isBenar) {
    gameState.jumlahSoalDijawab++;
    const divHasil = document.getElementById("hasil-lab");
    if (isBenar) {
        gameState.jawabanBenar++;
        tambahPoin(40);
        gameState.totalPermainanSelesai = Math.max(gameState.totalPermainanSelesai, 5);
        divHasil.innerHTML = `<div class="alert alert-success"><strong>Tepat sekali!</strong> Pengunyahan memperluas permukaan makanan sehingga enzim lebih mudah mencernanya. +40 Poin.</div>`;
    } else {
        gameState.jawabanSalah++;
        playSound('error');
        divHasil.innerHTML = `<div class="alert alert-danger">Kurang tepat. Ingat bahwa pencernaan mekanis oleh gigi memperluas bidang sentuh enzim pencernaan kimiawi!</div>`;
    }
    document.getElementById("current-game-score").innerText = gameState.totalPoin;
}

// ==========================================
// GAME 6: TANTANGAN PINTAR IPA (KUIS)
// ==========================================
function muatGameKuis(container) {
    window.kuisSoalList = [
        { t: "Enzim amilase yang terdapat di dalam air liur berfungsi untuk memecah...", p: ["Protein menjadi asam amino", "Amilum / pati menjadi maltosa", "Lemak menjadi gliserol", "Vitamin menjadi mineral"], j: 1 },
        { t: "Gerakan meremas-remas pada dinding kerongkongan disebut...", p: ["Gerak peristaltik", "Gerak lokon", "Gerak tropisme", "Gerak refleks"], j: 0 },
        { t: "Cairan empedu yang dihasilkan oleh hati memiliki fungsi utama yaitu...", p: ["Mematikan seluruh bakteri lambung", "Menghasilkan asam klorida", "Mengemulsikan lemak", "Membentuk sel darah merah"], j: 2 },
        { t: "Bagian usus halus yang sering disebut sebagai usus dua belas jari adalah...", p: ["Jejunum", "Ileum", "Duodenum", "Cecum"], j: 2 },
        { t: "Organ pencernaan yang bertugas menyerap sisa air dan membentuk feses adalah...", p: ["Lambung", "Usus Besar", "Empedu", "Pankreas"], j: 1 }
    ];
    window.kuisIndex = 0;
    window.kuisSkorMisi = 0;

    renderKuisSoal(container);
}

function renderKuisSoal(container) {
    let q = window.kuisSoalList[window.kuisIndex];
    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="badge bg-primary fs-6">Soal Kuis ${window.kuisIndex + 1} dari ${window.kuisSoalList.length}</span>
            <span class="text-muted small">Poin Kuis: <strong class="text-danger">${window.kuisSkorMisi}</strong></span>
        </div>
        <h5 class="fw-bold text-dark mb-4">${q.t}</h5>
        <div class="row g-2 mb-3">
            ${q.p.map((pil, idx) => `
                <div class="col-md-6">
                    <button class="btn btn-outline-primary w-100 text-start p-3 fw-bold rounded-3 shadow-sm" onclick="jawabKuis(${idx})">${pil}</button>
                </div>
            `).join('')}
        </div>
        <div id="hasil-kuis"></div>
    `;
}

function jawabKuis(pilihanSiswa) {
    let q = window.kuisSoalList[window.kuisIndex];
    gameState.jumlahSoalDijawab++;

    if (pilihanSiswa === q.j) {
        gameState.jawabanBenar++;
        window.kuisSkorMisi += 20;
        tambahPoin(20);
        playSound('success');
    } else {
        gameState.jawabanSalah++;
        playSound('error');
    }

    window.kuisIndex++;
    if (window.kuisIndex < window.kuisSoalList.length) {
        renderKuisSoal(document.getElementById("game-container-body"));
    } else {
        gameState.totalPermainanSelesai = Math.max(gameState.totalPermainanSelesai, 6);
        tambahPoin(50);
        document.getElementById("game-container-body").innerHTML = `
            <div class="text-center py-4">
                <div class="display-1 text-primary mb-3"><i class="fas fa-trophy"></i></div>
                <h3 class="fw-bold text-dark">Kuis Tantangan Pintar Selesai!</h3>
                <p class="text-muted">Skor yang kamu kumpulkan dari kuis ini adalah ${window.kuisSkorMisi} poin.</p>
                <button class="btn btn-primary rounded-pill px-4 fw-bold" onclick="kembaliKeMenu()">Kembali ke Peta Misi</button>
            </div>
        `;
    }
    document.getElementById("current-game-score").innerText = gameState.totalPoin;
}

// ==========================================
// GAME 7: PAHLAWAN PENCERNAAN (ANALISIS KASUS)
// ==========================================
function muatGamePahlawan(container) {
    container.innerHTML = `
        <div class="alert alert-success d-flex align-items-center">
            <i class="fas fa-heartbeat fa-2x me-3"></i>
            <div><strong>Kasus Pahlawan Pencernaan:</strong><br>Rina jarang makan sayur & buah serta kurang minum air putih, sehingga sering mengalami kesulitan buang air besar (sembelit/konstipasi).</div>
        </div>
        <h5 class="fw-bold text-dark mb-3">Tindakan pencegahan dan solusi terbaik bagi Rina adalah...</h5>
        <div class="d-grid gap-2 mb-3">
            <button class="btn btn-outline-success text-start p-3 fw-bold rounded-3" onclick="jawabPahlawan(false)">A. Mengurangi porsi makan secara drastis</button>
            <button class="btn btn-outline-success text-start p-3 fw-bold rounded-3" onclick="jawabPahlawan(true)">B. Meningkatkan konsumsi makanan berserat tinggi (buah & sayur) serta minum air putih yang cukup</button>
            <button class="btn btn-outline-success text-start p-3 fw-bold rounded-3" onclick="jawabPahlawan(false)">C. Menghindari segala aktivitas fisik dan banyak tidur</button>
        </div>
        <div id="hasil-pahlawan"></div>
    `;
}

function jawabPahlawan(isBenar) {
    gameState.jumlahSoalDijawab++;
    const divHasil = document.getElementById("hasil-pahlawan");
    if (isBenar) {
        gameState.jawabanBenar++;
        tambahPoin(50, "Lencana Pahlawan Pencernaan");
        gameState.totalPermainanSelesai = Math.max(gameState.totalPermainanSelesai, 7);
        gameState.levelTertinggi = "Pahlawan Pencernaan (Level 4)";
        divHasil.innerHTML = `<div class="alert alert-success"><strong>Sempurna!</strong> Serat dan air sangat penting untuk melancarkan gerak peristaltik usus besar dan mencegah konstipasi. +50 Poin.</div>`;
    } else {
        gameState.jawabanSalah++;
        playSound('error');
        divHasil.innerHTML = `<div class="alert alert-danger">Kurang tepat. Kekurangan serat dan air adalah penyebab utama sembelit.</div>`;
    }
    document.getElementById("current-game-score").innerText = gameState.totalPoin;
}

// ==========================================
// HASIL AKHIR & KONEKSI SUPABASE CLOUD
// ==========================================
function tampilkanHasilAkhir() {
    playSound('click');
    switchPage('page-hasil');

    document.getElementById("sertifikat-nama").innerText = gameState.namaSiswa || "Siswa Teladan";
    document.getElementById("sertifikat-kelas").innerText = gameState.kelasSiswa || "-";
    document.getElementById("res-poin").innerText = gameState.totalPoin;
    document.getElementById("res-benar").innerText = gameState.jawabanBenar;
    document.getElementById("res-total-soal").innerText = gameState.jumlahSoalDijawab || 1;

    let persen = gameState.jumlahSoalDijawab > 0 ? Math.round((gameState.jawabanBenar / gameState.jumlahSoalDijawab) * 100) : 0;
    document.getElementById("res-persen").innerText = persen + "%";

    let kategori = "Perlu Belajar Lagi";
    let badgeClass = "bg-danger";
    if (persen >= 90) { kategori = "Sangat Baik"; badgeClass = "bg-success"; }
    else if (persen >= 80) { kategori = "Baik"; badgeClass = "bg-primary"; }
    else if (persen >= 70) { kategori = "Cukup"; badgeClass = "bg-warning text-dark"; }

    const katEl = document.getElementById("res-kategori");
    katEl.innerText = kategori;
    katEl.className = "badge " + badgeClass;

    document.getElementById("res-level").innerText = gameState.levelTertinggi;
    document.getElementById("res-lencana").innerText = gameState.lencanaDiperoleh.length > 0 ? gameState.lencanaDiperoleh.join(", ") : "Belum ada lencana";

    // Kirim data otomatis ke Supabase Cloud
    kirimDataKeDatabase();
}

async function kirimDataKeDatabase() {
    if (!gameState.namaSiswa || !gameState.kelasSiswa) return;

    let persen = gameState.jumlahSoalDijawab > 0 ? (gameState.jawabanBenar / gameState.jumlahSoalDijawab) * 100 : 0;
    let kategori = persen >= 90 ? "Sangat Baik" : (persen >= 80 ? "Baik" : (persen >= 70 ? "Cukup" : "Perlu Belajar Lagi"));

    let dataPayload = {
        nama_siswa: gameState.namaSiswa,
        kelas: gameState.kelasSiswa,
        total_permainan: gameState.totalPermainanSelesai,
        jumlah_soal: gameState.jumlahSoalDijawab,
        jawaban_benar: gameState.jawabanBenar,
        jawaban_salah: gameState.jawabanSalah,
        persentase: persen.toFixed(2),
        total_poin: gameState.totalPoin,
        level_tertinggi: gameState.levelTertinggi,
        lencana: gameState.lencanaDiperoleh.join(", "),
        kategori: kategori
    };

    try {
        const { error } = await supabaseClient
            .from('hasil_siswa')
            .insert([dataPayload]);

        if (error) throw error;
        console.log("Berhasil menyimpan data ke Supabase Cloud.");
    } catch (err) {
        console.error("Gagal menyimpan ke Supabase:", err.message);
    }
}

// ==========================================
// DASHBOARD GURU
// ==========================================
function bukaDashboardGuru() {
    playSound('click');
    switchPage('page-dashboard');
    muatDataGuru();
}

async function muatDataGuru() {
    const tbody = document.getElementById("tabel-nilai-body");
    tbody.innerHTML = `<tr><td colspan="10" class="text-center text-muted py-4"><i class="fas fa-spinner fa-spin me-2"></i> Mengambil data dari Supabase Cloud...</td></tr>`;

    try {
        const { data, error } = await supabaseClient
            .from('hasil_siswa')
            .select('*')
            .order('tanggal', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="10" class="text-center text-muted py-4">Belum ada data nilai siswa yang tersimpan di Supabase Cloud.</td></tr>`;
            return;
        }

        tbody.innerHTML = data.map((row, idx) => `
            <tr>
                <td class="text-center">${idx + 1}</td>
                <td class="fw-bold">${row.nama_siswa}</td>
                <td class="text-center">${row.kelas}</td>
                <td class="text-center text-danger fw-bold">${row.total_poin}</td>
                <td class="text-center">${row.jawaban_benar} / ${row.jumlah_soal}</td>
                <td class="text-center fw-bold text-primary">${row.persentase}%</td>
                <td class="text-center"><span class="badge bg-success">${row.kategori}</span></td>
                <td class="text-center small">${row.level_tertinggi}</td>
                <td class="small">${row.lencana || '-'}</td>
                <td class="text-center small text-muted">${new Date(row.tanggal).toLocaleString('id-ID')}</td>
            </tr>
        `).join('');

    } catch (err) {
        console.error("Error mengambil data:", err.message);
        tbody.innerHTML = `<tr><td colspan="10" class="text-center text-danger py-4"><i class="fas fa-exclamation-triangle me-2"></i> Gagal terhubung ke Supabase Cloud: ${err.message}</td></tr>`;
    }
}
