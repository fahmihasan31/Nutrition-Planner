# 🥗 Nutrition Planner Backend

**Nutrition Planner Backend** adalah backend API untuk aplikasi perencanaan gizi yang memberikan rekomendasi makanan berdasarkan rencana makan pengguna.

---

## ⚙️ Teknologi yang Digunakan

- 🟩 Node.js
- 🚀 Express.js
- 🐬 MySQL
- 🧬 Sequelize ORM

## 🧰 Persyaratan Sistem

Pastikan kamu sudah menginstal:

- [Node.js](https://nodejs.org/)
- [XAMPP](https://www.apachefriends.org/index.html)
- [Sequelize CLI](https://sequelize.org/) → Install dengan `npm install -g sequelize-cli`

---

## 🚀 Cara Menjalankan Proyek

1. **Clone repository ini ke komputer kamu:**

   ```bash
   git clone https://github.com/fahmihasan31/Nutrition-Planner.git
   cd nutrition-planner-backend
   ```

2. **Install semua dependency yang dibutuhkan:**

   ```bash
   npm install
   ```

3. **Aktifkan XAMPP**, lalu jalankan:

   - Apache ✅
   - MySQL ✅

4. **Buka phpMyAdmin** melalui browser:

   ```
   http://localhost/phpmyadmin
   ```

5. **Buat database baru** dengan nama:

   ```
   nutrition_planner
   ```

6. Setelah membuat database, **klik tab "Import"**, lalu upload file `nutrition_planner.sql` dari folder project dan klik **Go**.

7. **Jalankan migrasi Sequelize** untuk membuat tabel di database:

   ```bash
   npx sequelize-cli db:migrate
   ```

   Jika ingin membatalkan migrasi:

   ```bash
   npx sequelize-cli db:migrate:undo       # Undo satu langkah
   npx sequelize-cli db:migrate:undo:all   # Undo semua migrasi
   ```

8. **Jalankan aplikasi backend:**

   - Untuk menjalankan secara normal:

     ```bash
     npm run start
     ```

   - Untuk menjalankan dengan auto-restart (nodemon):

     ```bash
     npm run start-dev
     ```

9. Aplikasi backend akan berjalan di:

   ```
   http://localhost:8000
   ```

---
