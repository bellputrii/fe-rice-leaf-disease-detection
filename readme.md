# 🎓 Ambil Prestasi

**Ambil Prestasi** adalah platform belajar online terpadu yang dirancang untuk membantu mahasiswa meraih prestasi terbaik mereka melalui materi pembelajaran berkualitas dan bimbingan dari mentor profesional.  
Platform ini menghadirkan pengalaman belajar yang fleksibel, memungkinkan mahasiswa belajar kapan saja dan di mana saja.

---

## 🚀 Fitur Utama

Platform ini menyediakan berbagai fitur untuk mendukung proses pembelajaran digital secara efektif dan interaktif.

- **Materi Pembelajaran Lengkap** — mencakup berbagai topik pengembangan akademik dan profesional.  
- **Fleksibilitas Waktu Belajar** — akses materi kapan pun tanpa batasan waktu.  
- **Mentor Profesional** — dibimbing langsung oleh pengajar berpengalaman di bidangnya.

---

## 👥 Role dan Hak Akses

### Admin  
Admin bertanggung jawab atas pengelolaan struktur utama platform.  
Dapat melakukan:
- CRUD Teacher (membuat, membaca, memperbarui, dan menghapus data pengajar).  
- CRUD Kategori Kelas untuk mengatur pengelompokan konten pembelajaran.

### Teacher (Pengajar)  
Teacher memiliki kendali penuh atas konten pembelajaran yang dibuat.  
Dapat melakukan:
- CRUD Kelas, Section, Materi, dan Quiz untuk menyusun alur pembelajaran yang sistematis.

### Student (Mahasiswa)  
Student dapat menjelajahi seluruh kelas yang tersedia melalui `GET /classes`, melihat detail kelas dan materi, serta mengakses materi penuh setelah mendaftar paket belajar tertentu.  
Setiap pendaftaran paket akan memberikan **kode referral** untuk mengakses semua kelas sesuai **durasi paket** yang dipilih.  
Student juga dapat melihat seluruh mentor melalui `GET /mentor`.

---

## 🧩 Arsitektur dan Deployment

Frontend dikembangkan menggunakan **Next.js** dan di-deploy melalui **Vercel** untuk memastikan performa tinggi dan skalabilitas.  
Backend dibangun dengan **Node.js** dan di-deploy menggunakan **Virtual Private Server (VPS)**.  
Keduanya terhubung melalui RESTful API dengan autentikasi berbasis role.

---

## ⚙️ Tech Stack

Framework utama yang digunakan adalah **Next.js 15.5.3** dengan bahasa pemrograman **TypeScript**.  
Antarmuka dirancang menggunakan **Tailwind CSS**, **Radix UI**, dan ikon dari **lucide-react** serta **@tabler/icons-react**.  

Komponen penting lainnya mencakup:
- Data visualization menggunakan **recharts**.  
- State management dengan **React 19.1.0**.  
- Validasi data menggunakan **zod**.  
- Fitur drag-and-drop dengan **@dnd-kit/core** dan **@dnd-kit/sortable**.  
- Sistem notifikasi dengan **sonner**.  
- Linting dan commit linting menggunakan **ESLint**, **commitlint**, dan **husky**.  
- Build tool menggunakan **Turbopack** untuk proses development dan build yang lebih cepat.

---

## 🧠 Panduan Pengembangan

Proyek ini dapat dijalankan secara lokal dengan langkah-langkah berikut.

### 1. Clone Repository
```bash
git clone https://github.com/username/ambilprestasi.git
cd ambilprestasi


### 2. Install Dependencies

```bash
npm install
```

### 3. Jalankan di Mode Pengembangan

```bash
npm run dev
```

### 4. Build untuk Produksi

```bash
npm run build
npm run start
```

---

## 🌐 Deployment

### Frontend

* Dideploy otomatis menggunakan Vercel pada alamat:
🔗 https://ambilprestasi.vercel.app
* Build tool menggunakan **Turbopack** untuk performa optimal.

### Backend

* Dideploy di **VPS** menggunakan konfigurasi Node.js + Express.
* API endpoint dihubungkan dengan frontend melalui konfigurasi environment variable (`NEXT_PUBLIC_API_URL`).

---

## 💡 Visi

Menjadi **platform pembelajaran digital unggulan** yang memberdayakan mahasiswa untuk berkembang, berkompetisi, dan berprestasi di dunia akademik maupun profesional melalui teknologi modern dan mentor inspiratif.

---

## 🧾 Lisensi

Proyek ini dilindungi oleh lisensi pribadi.
Dilarang memperbanyak atau mendistribusikan ulang tanpa izin dari pengembang resmi.

---

### ✨ Dibangun dengan semangat kolaborasi dan pembelajaran berkelanjutan.