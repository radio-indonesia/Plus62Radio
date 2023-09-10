<div style="text-align:center"> 
    <img src="assets/logo.svg" />
</div>

<p align="center" >
    <a href="https://discord.com/api/oauth2/authorize?client_id=774329375206277122&permissions=2150909952&scope=bot%20applications.commands">
        <img src="https://img.shields.io/badge/Undang-Discord-7289da?style=flat&logo=discord&logoColor=white"/>
    </a>
    <a href="https://discord.gg/XmqkJRmcty">
        <img src="https://img.shields.io/badge/Dukungan-Discord-7289da?style=flat&logo=discord&logoColor=white" />
    </a>
</p>

## Overview

Lrmn adalah bot radio sederhana untuk Discord. Jika Anda penggemar mendengarkan musik, dan Anda bosan dengan daftar putar Anda, maka Lrmn adalah solusi terbaik untuk Anda dan anggota server Anda.

[Pemasangan](#pemasangan) tidak memakan waktu lama jika Anda mengikuti petunjuknya. Hanya beberapa klik, dan bot sudah ada di server Anda di saluran yang tepat, disetel ke frekuensi yang tepat, dan memainkan musik keren.

**Bot ini memiliki beberapa fitur keren:**

-  Mengatur saluran radio dengan satu perintah
-  Pemutaran musik 24/7
-  Dukungan untuk perintah slash
-  Banyak stasiun radio
-  Anda dapat mengetahui nama musik saat ini di radio

## Prasyarat

Sebelum memulai instalasi, pastikan Anda memiliki alat berikut terinstal:

-  **[NodeJS](https://nodejs.org/)** (versi 16 atau lebih tinggi)
-  **[Yarn](https://yarnpkg.com/)**
-  **[Git](https://git-scm.com/)**

## Pemasangan

Pertama, Anda perlu mengklon repository bot dengan perintah berikut:

```bash
git clone https://github.com/Noktomezo/Lrmn-discord-bot.git
```

Then you need to install all dependencies:

```bash
yarn
# or
yarn install
```

Sebelum menjalankannya, Anda perlu menyiapkan variabel lingkungan. Ganti nama file **`.env.example`** menjadi **`.env`** dan ubah nilai-nilainya sesuai yang diinginkan:

-  **`DISCORD_TOKEN`**: Token bot Discord Anda. Untuk mendapatkannya, masuk ke [situs ini](https://discord.com/developers/applications) dan buat aplikasi baru. Di bawah tab "**Bot**", salin token bot Anda.
-  **`MONGO_CONNECTION_URL`**: Tautan untuk menghubungkan ke basis data MongoDB Anda. Daftar atau masuk, lalu buat basis data baru dengan mengklik tombol "**Proyek Baru**" dan ikuti petunjuknya, dan deploy basis data Anda dengan rencana yang diinginkan (rencana gratis mencakup semua kebutuhan bot). Kemudian konfigurasikan data untuk menghubungkan ke basis data Anda dan klik "**Buat Pengguna**". Di baris "**Alamat IP**", masukkan **`0.0.0.0/0`** sehingga Anda dapat terhubung ke basis data dari alamat IP mana pun atau masukkan alamat IP Anda sendiri. Selesaikan pembuatan basis data Anda dan klik "**Hubungkan**" dan temukan URL koneksi (misalnya, klik tab "**Kompaas**"), seharusnya terlihat seperti ini: **`mongodb+srv://{username}:{password}@xxx.xxx.mongodb.net/`**. Yang perlu Anda lakukan adalah mengganti **`{username}`** dan **`{password}`** dengan nilai yang ditentukan di awal pembuatan basis data. Jika Anda berencana untuk menghubungkan beberapa bot ke basis data yang sama, tentukan nama **koleksi** di akhir URL koneksi, seperti **`mongodb+srv://uuu:ppp@xxx.xxx.mongodb.net/{collection}`**
-  **`DEFAULT_LOCALE`**: Bahasa default bot diperlukan untuk tampilan log yang benar (tidak memengaruhi bahasa bot di server), bahasa yang tersedia dapat ditemukan di folder **`locales`**, tentukan nama file tanpa ekstensi (tanpa '.json').
-  **`TIMEZONE`**: Zona waktu, diperlukan untuk tampilan waktu yang benar dalam log, dapat ditemukan [di sini](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) di kolom "**TZ identifier**"

## Menjalankan

Ketika semua sudah siap, bangun bot Anda dan jalankannya:

```bash
yarn build
yarn start
```

## Menjalankan dalam mode pengembangan

Bot juga dapat dijalankan dalam mode pengembangan, di mana bot akan segera restart ketika ada perubahan:

```bash
yarn start:dev
```

## License

Dirilis di bawah lisensi [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html) license.
