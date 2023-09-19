# Gunakan image Node.js LTS sebagai dasar
FROM node:18.7.0-slim AS base

# Install ffmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg tini libssl-dev ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Install dependencies
FROM base AS dependencies

WORKDIR /usr/app

# Salin berkas package.json dan package-lock.json ke direktori kerja
COPY package*.json .
COPY yarn.lock .

# Instal dependensi Node.js dengan Yarn
RUN yarn install

# Salin sumber kode aplikasi ke direktori kerja
COPY . .

# Build proyek TypeScript
RUN yarn build

# Tentukan perintah untuk menjalankan aplikasi Anda
CMD ["node", "dist/sharding.js"]