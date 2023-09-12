# Gunakan image Node.js LTS sebagai dasar
FROM node:18-slim

# Install python3
RUN apt-get update && apt-get install -y python3 make g++ --fix-missing


# Setel direktori kerja di dalam kontainer
WORKDIR /app

# Salin berkas package.json dan package-lock.json ke direktori kerja
COPY package*.json ./

# Instal dependensi Node.js
RUN npm install

# Salin sumber kode aplikasi ke direktori kerja
COPY . .

# Build proyek TypeScript
RUN npm run build

# Instal ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Tentukan perintah untuk menjalankan aplikasi Anda
CMD ["node", "dist/sharding.js"]
