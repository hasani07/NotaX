# Cara Pakai NotaX Google Apps Script

File utama:
- `apps-script/Code.gs`

Script ini dipakai untuk menghubungkan NotaX dengan Google Spreadsheet.

## Fungsi yang didukung

Script ini menangani:

- Tambah data transaksi baru
- Baca data dari Google Sheet
- Edit transaksi yang sudah ada
- Hapus transaksi
- Sinkronisasi link bukti nota
- Update otomatis sheet `Ringkasan`
- Menjumlahkan total berdasarkan sumber uang

## 1. Simpan di GitHub

Di repository NotaX, buat struktur seperti ini:

```text
NotaX/
├─ index.html
├─ apps-script/
│  └─ Code.gs
├─ supabase/
│  └─ migration.sql
└─ README.md
```

File `Code.gs` di GitHub hanya berfungsi sebagai source code / backup.

GitHub dan Vercel tidak menjalankan Apps Script ini secara langsung.

## 2. Buka Google Spreadsheet

Buka spreadsheet yang digunakan oleh project NotaX.

Pastikan spreadsheet memiliki sheet bernama:

```text
Catatan
```

Kalau belum ada, script akan otomatis membuat sheet `Catatan`.

Script juga akan membuat sheet:

```text
Ringkasan
```

jika belum tersedia.

## 3. Buka Google Apps Script

Dari Google Spreadsheet:

```text
Extensions
→ Apps Script
```

Hapus code lama di editor Apps Script, lalu copy seluruh isi:

```text
apps-script/Code.gs
```

ke file `Code.gs` di Google Apps Script.

Setelah itu klik:

```text
Save
```

## 4. Deploy sebagai Web App

Di Google Apps Script pilih:

```text
Deploy
→ New deployment
```

Pilih tipe:

```text
Web app
```

Atur:

```text
Execute as:
Me

Who has access:
Anyone
```

Lalu klik:

```text
Deploy
```

Google akan memberikan URL seperti:

```text
https://script.google.com/macros/s/XXXXXXXXXXXX/exec
```

URL ini disebut Apps Script Web App URL.

## 5. Masukkan URL Apps Script ke NotaX

Di NotaX:

1. Pilih project yang ingin dikonfigurasi.
2. Klik:

```text
Atur link project
```

3. Isi:
   - Google Spreadsheet URL
   - Apps Script Web App URL

Contoh:

```text
Spreadsheet:
https://docs.google.com/spreadsheets/d/XXXXXXXXXXXX/edit

Apps Script:
https://script.google.com/macros/s/XXXXXXXXXXXX/exec
```

Setelah disimpan, setiap transaksi untuk project tersebut akan disinkronkan ke spreadsheet itu.

## 6. Format Sheet `Catatan`

Script menggunakan kolom berikut:

| Kolom | Isi |
|---|---|
| A | ID |
| B | Tanggal |
| C | Beli Apa |
| D | Total |
| E | Pakai Uang |
| F | Project |
| G | Ada Bukti Nota |
| H | Link Foto Nota |
| I | Catatan |
| J | Waktu Simpan |

Jangan mengubah urutan kolom tanpa menyesuaikan script.

## 7. Tambah Transaksi

Saat transaksi baru dibuat di NotaX:

```text
NotaX
→ Supabase
→ Apps Script
→ Google Spreadsheet
```

Apps Script akan menambahkan baris baru ke sheet `Catatan`.

## 8. Edit Transaksi

Saat tombol `Edit` digunakan di NotaX, frontend akan mengirim:

```text
action=update
```

beserta ID transaksi.

Apps Script akan mencari baris dengan ID yang sama dan memperbarui data pada baris tersebut.

Artinya edit tidak membuat duplikat jika ID ditemukan.

## 9. Hapus Transaksi

Saat transaksi dihapus dari NotaX, frontend mengirim:

```text
action=delete
```

dengan ID transaksi.

Apps Script akan mencari ID tersebut lalu menghapus baris yang sesuai.

## 10. Baca Data

Apps Script masih mendukung:

```text
?action=read
```

Fungsi ini dipertahankan agar kompatibel dengan mekanisme NotaX lama.

## 11. Sheet Ringkasan

Setiap kali ada:

- transaksi baru
- edit transaksi
- hapus transaksi

script akan menjalankan:

```text
updateRingkasan_()
```

Sheet `Ringkasan` akan dihitung ulang berdasarkan:

```text
Pakai Uang
```

Contohnya:

| Pakai Uang | Total |
|---|---:|
| BRI ZTS | Rp 8.500.000 |
| HSN | Rp 2.000.000 |
| IHZA GANTENG | Rp 4.000.000 |
| Total Semua | Rp 14.500.000 |

## 12. Jika Code.gs Diubah

Kalau kamu mengubah Apps Script setelah sebelumnya sudah dideploy, jangan hanya klik Save.

Lakukan:

```text
Deploy
→ Manage deployments
→ Edit
→ Version
→ New version
→ Deploy
```

Biasanya URL Web App tetap sama.

Ini penting supaya versi terbaru benar-benar dipakai NotaX.

## 13. Jika Edit Tidak Berfungsi

Cek hal berikut:

- Apps Script sudah dideploy ulang
- NotaX menggunakan Web App URL terbaru
- ID di kolom A sheet `Catatan` masih ada
- Jangan menghapus ID transaksi secara manual
- Pastikan Apps Script tidak menunjukkan error pada menu `Executions`

## 14. Jika Project Berbeda Punya Spreadsheet Berbeda

NotaX mendukung link spreadsheet per project.

Contoh:

```text
T4T
→ Spreadsheet T4T
→ Apps Script T4T

Aset
→ Spreadsheet Aset
→ Apps Script Aset
```

Kalau setiap project memakai spreadsheet berbeda, deploy Apps Script pada masing-masing spreadsheet lalu masukkan masing-masing Web App URL melalui `Atur link project`.

## 15. Hubungan dengan Supabase

Supabase tetap menjadi database utama NotaX.

Google Spreadsheet lebih cocok dianggap sebagai:

- mirror data
- laporan
- backup operasional
- tempat tim melihat transaksi

Alur utamanya:

```text
NotaX Frontend
      ↓
   Supabase
      ↓
Google Apps Script
      ↓
Google Spreadsheet
```

Jadi jangan menghapus data Supabase hanya karena data sudah ada di spreadsheet.

## 16. File yang Dipakai

Untuk versi NotaX terbaru:

```text
index.html
```

Frontend utama.

```text
apps-script/Code.gs
```

Google Apps Script.

```text
supabase/migration.sql
```

Migration database Supabase.

```text
NotaX_Supabase_Config.md
```

Dokumentasi akun dan konfigurasi deployment.

## Catatan Keamanan

Jangan simpan di GitHub:

- password Gmail
- password Supabase
- service_role key
- private API key
- token rahasia lain

Publishable / anon key Supabase boleh berada di frontend selama Row Level Security dikonfigurasi dengan benar.
