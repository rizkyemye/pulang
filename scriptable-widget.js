// ===== Widget "Pulang ke Indonesia" untuk iPhone (app Scriptable, gratis) =====
// Cara pakai singkat:
// 1) Install "Scriptable" dari App Store (gratis)
// 2) Buka Scriptable -> + -> tempel seluruh isi berkas ini -> simpan, beri nama "Pulang"
// 3) Tahan layar utama iPhone -> + (kiri atas) -> cari "Scriptable" -> pilih ukuran (Small/Medium)
// 4) Tahan widget yang muncul -> Edit Widget -> Script: pilih "Pulang"
//    (di bagian Parameter, isi tanggal kalau mau ganti: 2027-01-05)

const TARGET_TEKS = (args.widgetParameter || "2027-01-05").trim();
const TARGET_NAMA = "Pulang ke Indonesia";
const KETEMU = "2027-01-06";
const KEMBALI = "2027-01-17";

function keTanggal(s) { const p = String(s).split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]); }
function hariSaja(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function selisih(a, b) { return Math.round((hariSaja(b) - hariSaja(a)) / 86400000); }
const BULAN = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
function tglTeks(d) { return d.getDate() + " " + BULAN[d.getMonth()] + " " + d.getFullYear(); }

const target = keTanggal(TARGET_TEKS);
const sekarang = new Date();
const sisa = selisih(sekarang, target);
const sisaKembali = selisih(sekarang, keTanggal(KEMBALI));

const w = new ListWidget();
w.setPadding(14, 14, 14, 14);
const grad = new LinearGradient();
grad.locations = [0, 1];
grad.colors = sisa > 14
  ? [new Color("#fb7185"), new Color("#e11d74")]
  : [new Color("#e11d74"), new Color("#9d174d")];
w.backgroundGradient = grad;
w.url = "https://rizkyemye.github.io/pulang/";

const label = w.addText("PULANG KE INDONESIA");
label.font = Font.boldSystemFont(9);
label.textColor = new Color("#ffffff", 0.85);

const angka = w.addText(sisa > 0 ? String(sisa) : "今ここ");
angka.font = Font.boldSystemFont(46);
angka.textColor = Color.white();
angka.minimumScaleFactor = 0.5;

if (sisa > 0) {
  const satuan = w.addText("hari lagi ✈️");
  satuan.font = Font.mediumSystemFont(12);
  satuan.textColor = new Color("#ffffff", 0.95);
  w.addSpacer(4);
  const baris = w.addText("tiba " + tglTeks(target) + "\nkembali " + tglTeks(keTanggal(KEMBALI)) + " (" + sisaKembali + " hari)");
  baris.font = Font.systemFont(9);
  baris.textColor = new Color("#ffffff", 0.85);
} else {
  const satuan = w.addText("Selamat datang! 🎉");
  satuan.font = Font.mediumSystemFont(12);
  satuan.textColor = Color.white();
}

if (config.runsInWidget) { Script.setWidget(w); }
else { await w.presentMedium(); }
Script.complete();
