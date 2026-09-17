// ===== Widget "Pulang ke Indonesia" untuk iPhone — versi cantik 🌸 =====
// App: Scriptable (gratis, App Store).
// 1) Scriptable -> + -> tempel seluruh isi berkas ini -> simpan, nama "Pulang"
// 2) Tahan layar utama -> + -> Scriptable -> pilih ukuran (Small / Medium)
// 3) Tahan widget -> Edit Widget -> Script: Pulang
//    Parameter (opsional): "2027-01-05"  atau  "2027-01-05|2027-01-10"
//    (format: tanggal-tiba | tanggal-lamaran)

const PARAM = (args.widgetParameter || "").trim();
const BAGIAN = PARAM.split("|");
const TGL_TIBA = (BAGIAN[0] || "2027-01-05").trim();
const TGL_LAMARAN = (BAGIAN[1] || "").trim();
const TGL_KEMBALI = "2027-01-17";
const MULAI_HITUNG = "2026-09-16";

const TEMA = {
  pinkTerang: ["#fb7185", "#e11d74"],
  pinkTua: ["#e11d74", "#831843"]
};
const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

// ---------- util tanggal ----------
function keTanggal(s) { const p = String(s).split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]); }
function hariSaja(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function selisih(a, b) { return Math.round((hariSaja(b) - hariSaja(a)) / 86400000); }
function tglTeks(d) { return d.getDate() + " " + BULAN[d.getMonth()] + " " + d.getFullYear(); }

// ---------- gambar: bunga sakura 5 kelopak ----------
function gambarSakura(ukuran, warnaKelopak, warnaTengah) {
  const dc = new DrawContext();
  dc.size = new Size(ukuran, ukuran);
  dc.opaque = false;
  dc.respectScreenScale = true;

  const pusat = ukuran / 2;
  const jariKelopak = ukuran * 0.285;     // jarak kelopak dari pusat
  const besar = ukuran * 0.36;            // besar tiap kelopak

  dc.setFillColor(warnaKelopak);
  for (let i = 0; i < 5; i++) {
    const sudut = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const x = pusat + Math.cos(sudut) * jariKelopak;
    const y = pusat + Math.sin(sudut) * jariKelopak;
    const p = new Path();
    p.addEllipse(new Rect(x - besar / 2, y - besar / 2, besar, besar));
    dc.addPath(p);
    dc.fillPath();
  }
  if (warnaTengah) {
    dc.setFillColor(warnaTengah);
    const pt = new Path();
    const r = ukuran * 0.10;
    pt.addEllipse(new Rect(pusat - r, pusat - r, r * 2, r * 2));
    dc.addPath(pt);
    dc.fillPath();
  }
  return dc.getImage();
}

// ---------- gambar: progress bar ----------
function gambarBar(lebar, tinggi, persen, warnaIsi, warnaDasar) {
  const dc = new DrawContext();
  dc.size = new Size(lebar, tinggi);
  dc.opaque = false;
  dc.respectScreenScale = true;

  function kotak(x, y, w, h, warna) {
    const p = new Path();
    p.addRoundedRect(new Rect(x, y, w, h), h / 2, h / 2);
    dc.addPath(p);
    dc.setFillColor(warna);
    dc.fillPath();
  }
  kotak(0, 0, lebar, tinggi, warnaDasar);
  const isi = Math.max(tinggi, lebar * Math.min(1, Math.max(0, persen)));
  kotak(0, 0, isi, tinggi, warnaIsi);
  return dc.getImage();
}

// ---------- angka utama ----------
const sekarang = new Date();
const target = keTanggal(TGL_TIBA);
const kembali = keTanggal(TGL_KEMBALI);
const mulai = keTanggal(MULAI_HITUNG);
const sisa = selisih(sekarang, target);
const sisaKembali = selisih(sekarang, kembali);
const sudahTiba = sisa <= 0;
const sudahPulang = sisaKembali <= 0;

const total = Math.max(1, target - mulai);
const jalan = Math.min(total, Math.max(0, sekarang - mulai));
const persen = jalan / total;

const tema = sisa <= 14 ? TEMA.pinkTua : TEMA.pinkTerang;
const ukuranWidget = config.widgetFamily || "medium";
const kecil = ukuranWidget === "small";

// ---------- widget ----------
const w = new ListWidget();
w.setPadding(kecil ? 14 : 16, 16, 14, 16);
w.url = "https://rizkyemye.github.io/pulang/";
// minta sistem refresh saat lewat tengah malam (biar angka gak telat)
const besok = new Date(sekarang.getFullYear(), sekarang.getMonth(), sekarang.getDate() + 1, 0, 5, 0);
w.refreshAfterDate = besok;

const grad = new LinearGradient();
grad.locations = [0, 1];
grad.colors = [new Color(tema[0]), new Color(tema[1])];
w.backgroundGradient = grad;

// ===== baris atas: judul + bunga =====
const atas = w.addStack();
atas.layoutHorizontally();
atas.centerAlignContent();

const bunga = gambarSakura(30, new Color("#ffffff", 0.92), new Color("#fde68a"));
const imgBunga = atas.addImage(bunga);
imgBunga.imageSize = new Size(15, 15);

atas.addSpacer(6);
const judul = atas.addText("PULANG KE INDONESIA");
judul.font = Font.boldSystemFont(kecil ? 8 : 9);
judul.textColor = new Color("#ffffff", 0.92);
judul.lineLimit = 1;
judul.minimumScaleFactor = 0.6;

atas.addSpacer();

// ikon kanan: salju (Hokkaido) + hati
if (!kecil) {
  const salju = SFSymbol.named("snowflake");
  if (salju) {
    const i = atas.addImage(salju.image);
    i.imageSize = new Size(11, 11);
    i.tintColor = new Color("#ffffff", 0.85);
  }
  atas.addSpacer(5);
  const hati = SFSymbol.named("heart.fill");
  if (hati) {
    const i2 = atas.addImage(hati.image);
    i2.imageSize = new Size(11, 11);
    i2.tintColor = new Color("#fde68a", 0.95);
  }
}

// ===== angka besar =====
w.addSpacer(kecil ? 6 : 4);

const barisAngka = w.addStack();
barisAngka.layoutHorizontally();
barisAngka.bottomAlignContent();

if (sudahTiba) {
  const t = barisAngka.addText("今ここ");
  t.font = Font.boldSystemFont(kecil ? 26 : 34);
  t.textColor = Color.white();
  t.minimumScaleFactor = 0.6;
} else {
  const angka = barisAngka.addText(String(sisa));
  angka.font = Font.boldSystemFont(kecil ? 54 : 62);
  angka.textColor = Color.white();
  angka.minimumScaleFactor = 0.5;
  angka.lineLimit = 1;
  barisAngka.addSpacer(5);
  const satuan = barisAngka.addText("hari");
  satuan.font = Font.mediumSystemFont(kecil ? 13 : 15);
  satuan.textColor = new Color("#ffffff", 0.95);
}

// ===== isi kecil =====
if (kecil) {
  w.addSpacer(2);
  const t = w.addText(sudahTiba ? "selamat datang 🎉" : "lagi ✈️ " + tglTeks(target));
  t.font = Font.systemFont(9);
  t.textColor = new Color("#ffffff", 0.9);
  t.lineLimit = 2;
} else {
  // bar progress
  w.addSpacer(8);
  const bar = w.addImage(gambarBar(240, 7, persen, new Color("#ffffff", 0.95), new Color("#ffffff", 0.28)));
  bar.imageSize = new Size(240, 7);

  w.addSpacer(7);
  const bawah = w.addStack();
  bawah.layoutHorizontally();
  const kiri = bawah.addText("tiba " + tglTeks(target));
  kiri.font = Font.systemFont(9);
  kiri.textColor = new Color("#ffffff", 0.9);
  bawah.addSpacer();
  const kanan = bawah.addText(sudahPulang ? "sudah balik ke Jepang" : "balik " + tglTeks(kembali) + " (" + sisaKembali + "h)");
  kanan.font = Font.systemFont(9);
  kanan.textColor = new Color("#ffffff", 0.9);
  kanan.lineLimit = 1;

  if (TGL_LAMARAN) {
    w.addSpacer(3);
    const lam = w.addText("🎀 lamaran " + tglTeks(keTanggal(TGL_LAMARAN)));
    lam.font = Font.systemFont(9);
    lam.textColor = new Color("#fde68a", 0.95);
  }
}

// bunga besar transparan di kanan bawah (hanya medium/large)
if (!kecil) {
  w.addSpacer();
  const hiasan = w.addStack();
  hiasan.layoutHorizontally();
  hiasan.addSpacer();
  const bungaBesar = gambarSakura(64, new Color("#ffffff", 0.26), null);
  const ib = hiasan.addImage(bungaBesar);
  ib.imageSize = new Size(30, 30);
}

if (config.runsInWidget) {
  Script.setWidget(w);
} else {
  await w.presentMedium();
}
Script.complete();
