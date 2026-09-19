export type Choice = {
  id: string;
  label: string;
  cost?: number;
  correct?: boolean;
  recommended?: boolean;
  style?: "Berani" | "Efisien" | "Hati-hati";
  consequence?: string;
  benefits?: string;
  risks?: string;
  allocation?: { label: string; value: number; color: string }[];
};

export type Supplier = {
  id: string;
  name: string;
  price: number;
  quality: string;
  capacity: string;
  delivery: string;
  risk: string;
  recommended?: boolean;
};

export type GameCase = {
  id: number;
  category: string;
  title: string;
  narrative?: string;
  question: string;
  choices: Choice[];
  explanation: string;
  kind?: "quiz" | "managerial" | "allocation" | "supplier" | "calculation" | "event";
  visual?: "factory" | "budget" | "event" | "supplier" | "inventory" | "marketing" | "calculator" | "rising";
};

export const INITIAL_BUDGET = 3_000_000;

// Edit supplier details here as the vendor research becomes available.
export const suppliers: Supplier[] = [
  { id: "supplier-a", name: "Kebun Kakao A", price: 580_000, quality: "Standar", capacity: "90 kg/bulan", delivery: "2–3 hari", risk: "Sedang" },
  { id: "supplier-b", name: "Bumi Bahan B", price: 750_000, quality: "Premium", capacity: "140 kg/bulan", delivery: "1–2 hari", risk: "Rendah", recommended: true },
  { id: "supplier-c", name: "Panen Ceria C", price: 640_000, quality: "Baik", capacity: "75 kg/bulan", delivery: "4–5 hari", risk: "Tinggi" },
];

const budgetColors = ["#E7A84B", "#F47C8C", "#7CC9A5", "#6675C8"];

export const cases: GameCase[] = [
  {
    id: 1, category: "Management Basics", title: "Peta Sebelum Berangkat",
    question: "Fungsi manajemen yang menetapkan tujuan jangka panjang, jangka pendek, dan strategi untuk menentukan langkah selanjutnya disebut…",
    choices: [
      { id: "organizing", label: "Organizing" },
      { id: "planning", label: "Planning", correct: true },
      { id: "controlling", label: "Controlling" },
    ],
    explanation: "Planning adalah proses menetapkan tujuan dan menentukan strategi untuk mencapainya.",
  },
  {
    id: 2, category: "Production", title: "Dapur Mulai Sibuk",
    narrative: "Batch perdana siap masuk oven. Yuk, kenali biaya yang benar-benar berkaitan dengan proses produksinya.",
    question: "Manakah biaya yang dikeluarkan perusahaan dalam proses produksi?",
    choices: [
      { id: "overhead", label: "Biaya overhead pabrik", correct: true },
      { id: "depreciation", label: "Biaya penyusutan" },
      { id: "interest", label: "Bunga bank" },
    ],
    explanation: "Biaya overhead pabrik mendukung proses produksi selain bahan baku dan tenaga kerja langsung, misalnya listrik oven dan perawatan alat.",
    visual: "factory",
  },
  {
    id: 3, category: "Production", title: "Dari Adonan Jadi Cuan",
    question: "Ciri utama perusahaan manufaktur adalah…",
    choices: [
      { id: "resell", label: "Membeli produk jadi lalu menjualnya kembali" },
      { id: "manufacture", label: "Mengolah bahan baku menjadi barang jadi", correct: true },
      { id: "service", label: "Menjual produk yang bersifat nonfisik" },
    ],
    explanation: "Perusahaan manufaktur mengolah bahan baku menjadi barang jadi. Di Crumberra, tepung dan cokelat berubah menjadi cookies siap jual.",
    visual: "factory",
  },
  {
    id: 4, category: "Finance", title: "Susun Loyang Anggaran",
    narrative: "Modal Crumberra Rp3.000.000. Sisihkan dana cadangan minimal 10%, dan budget marketing tidak boleh lebih rendah daripada produksi.",
    question: "Alokasi mana yang memenuhi semua ketentuan?",
    kind: "allocation", visual: "budget",
    choices: [
      { id: "allocation-a", label: "Rencana A", correct: true, allocation: [
        { label: "Bahan baku", value: 1_000_000, color: budgetColors[0] }, { label: "Produksi", value: 500_000, color: budgetColors[1] },
        { label: "Marketing", value: 1_200_000, color: budgetColors[2] }, { label: "Cadangan", value: 300_000, color: budgetColors[3] },
      ]},
      { id: "allocation-b", label: "Rencana B", allocation: [
        { label: "Bahan baku", value: 1_500_000, color: budgetColors[0] }, { label: "Produksi", value: 1_000_000, color: budgetColors[1] },
        { label: "Marketing", value: 500_000, color: budgetColors[2] }, { label: "Cadangan", value: 0, color: budgetColors[3] },
      ]},
      { id: "allocation-c", label: "Rencana C", allocation: [
        { label: "Bahan baku", value: 1_200_000, color: budgetColors[0] }, { label: "Produksi", value: 700_000, color: budgetColors[1] },
        { label: "Marketing", value: 600_000, color: budgetColors[2] }, { label: "Cadangan", value: 500_000, color: budgetColors[3] },
      ]},
    ],
    explanation: "Rencana A pas Rp3.000.000, menyediakan cadangan 10%, dan menempatkan marketing di atas biaya produksi. Ini rencana—saldo baru berkurang ketika transaksi benar-benar terjadi.",
  },
  {
    id: 5, category: "Event Card", title: "Oven Mogok!", kind: "event", visual: "event",
    narrative: "Alat produksi mendadak rusak. Biaya perbaikan Rp300.000, sementara dana cadangan yang tersedia hanya Rp200.000.",
    question: "Bagaimana kamu menutup biaya perbaikan?",
    choices: [
      { id: "repair-marketing", label: "Pakai cadangan Rp200.000 + kurangi marketing Rp100.000", cost: 300_000, style: "Efisien", consequence: "Oven cepat kembali bekerja dan arus produksi aman.", benefits: "Masalah selesai tanpa utang.", risks: "Jangkauan kampanye berkurang." },
      { id: "repair-material", label: "Kurangi pembelian bahan baku Rp300.000", cost: 300_000, style: "Hati-hati", consequence: "Perbaikan tertutup, tetapi kapasitas batch berikutnya turun.", benefits: "Budget marketing tetap utuh.", risks: "Stok produk bisa menipis." },
      { id: "repair-funding", label: "Cari sumber dana lain", cost: 0, style: "Berani", consequence: "Saldo internal tidak berubah untuk saat ini.", benefits: "Rencana budget tetap berjalan.", risks: "Ada risiko bunga atau kewajiban baru." },
    ],
    explanation: "Tidak ada satu jawaban mutlak. Manajer perlu menimbang kelangsungan produksi, dampak promosi, dan risiko pendanaan.",
  },
  {
    id: 6, category: "Production", title: "Audisi Supplier", kind: "supplier", visual: "supplier",
    narrative: "Crumberra perlu supplier bahan baku yang konsisten dengan standar kualitas produksi.",
    question: "Supplier mana yang paling tepat untuk diajak bertumbuh?",
    choices: suppliers.map((supplier) => ({ id: supplier.id, label: supplier.name, cost: supplier.price, recommended: supplier.recommended })),
    explanation: "Supplier B direkomendasikan. Harganya lebih tinggi, tetapi kualitas premium, kapasitas besar, pengiriman cepat, dan risiko rendah memberi nilai yang lebih sehat untuk produksi.",
  },
  {
    id: 7, category: "Inventory", title: "Diskon yang Menggoda", visual: "inventory",
    narrative: "Bahan baku saat ini masih cukup untuk menghasilkan 85 toples. Supplier menawarkan diskon pembelian dalam jumlah besar.",
    question: "Apa keputusanmu sebagai manager?",
    choices: [
      { id: "buy-none", label: "Tidak membeli bahan baku sama sekali", cost: 0, correct: true },
      { id: "buy-max", label: "Membeli sebanyak mungkin karena sedang diskon", cost: 450_000 },
      { id: "buy-near", label: "Membeli sesuai kebutuhan produksi terdekat", cost: 250_000 },
    ],
    explanation: "Stok untuk 85 toples masih cukup. Pembelian berlebih menahan dana dalam persediaan dan meningkatkan risiko bahan tidak segera digunakan.",
  },
  {
    id: 8, category: "Marketing", title: "Pilih Panggung Promosi", visual: "marketing",
    narrative: "Budget khusus marketing Crumberra bulan ini Rp500.000.",
    question: "Paket pengeluaran mana yang paling tepat?",
    choices: [
      { id: "ads-booth", label: "Instagram Ads + Sewa Booth Bazar", cost: 600_000 },
      { id: "ads-packaging", label: "Instagram Ads + Kemasan baru", cost: 500_000 },
      { id: "booth", label: "Hanya menyewa Booth Bazar", cost: 350_000, correct: true },
    ],
    explanation: "Ads + booth melebihi budget. Kemasan termasuk biaya produksi, bukan marketing. Booth Bazar tetap dalam budget dan menyisakan Rp150.000.",
  },
  {
    id: 9, category: "Finance", title: "Hitung Hasil Panggang", kind: "calculation", visual: "calculator",
    narrative: "Pendapatan Rp3.500.000. Biaya: bahan baku Rp1.200.000, produksi Rp700.000, packaging Rp300.000, marketing Rp400.000, dan operasional Rp250.000.",
    question: "Berapa total keuntungan Crumberra?",
    choices: [
      { id: "profit-1300", label: "Rp1.300.000" },
      { id: "profit-2850", label: "Rp2.850.000" },
      { id: "profit-650", label: "Rp650.000", correct: true },
    ],
    explanation: "Total biaya = Rp2.850.000. Keuntungan = Rp3.500.000 − Rp2.850.000 = Rp650.000.",
  },
  {
    id: 10, category: "Finance", title: "Harga Bahan Naik", visual: "rising",
    narrative: "Bulan lalu laba bersih Rp650.000 dari 100 toples. Bahan baku dan packaging kini naik Rp3.000 per toples, sementara harga jual dan kualitas tetap.",
    question: "Apa dampaknya pada keuntungan bersih?",
    choices: [
      { id: "loss-300", label: "Crumberra rugi Rp300.000" },
      { id: "profit-350", label: "Keuntungan bersih turun menjadi Rp350.000", correct: true },
      { id: "no-impact", label: "Keuntungan tidak terganggu jika marketing menjadi Rp0" },
    ],
    explanation: "Kenaikan biaya = Rp3.000 × 100 = Rp300.000. Keuntungan baru = Rp650.000 − Rp300.000 = Rp350.000.",
  },
];

export const formatRupiah = (amount: number) => new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", maximumFractionDigits: 0,
}).format(amount);
