
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxZsWerzm0vm_jCo2-FyqqaJYUvwNSryYtY03d0UUDPktf8jUO2CFdv7GQavjubBffwVQ/exec";

document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.getElementById("table-body");
  const loading = document.getElementById("loading");
  const errorDiv = document.getElementById("error");
  const table = document.getElementById("pbb-table");

  fetch(WEB_APP_URL)
    .then((res) => res.json())
    .then((json) => {
      if (!json || !json.data) {
        throw new Error("Data tidak valid atau kosong");
      }

      // Bersihkan tabel sebelum memasukkan data baru
      tableBody.innerHTML = "";

      json.data.forEach((row) => {
        // Normalisasi kolom dan tangani nilai null
        const normalizedRow = {
          NOP: row.NOP || "-",
          Nama_WP: row.Nama_WP || "-",
          Alamat_WP: row.Alamat_WP || "-",
          Alamat_Objek: row.Alamat_Objek || "-",
          Pokok_PBB: row.Pokok_PBB || 0,
          Status: row.Status || "-",
          Tanggal_Bayar: row.Tanggal_Bayar ? new Date(row.Tanggal_Bayar).toLocaleDateString("id-ID") : "-",
          Pemilik: row.Pemilik || "-",
          Kolektor: row.Kolektor || "-",
          Validasi: row.Validasi || "-",
          Keterangan: row.Keterangan || "-"
        };

        // Buat baris tabel
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${normalizedRow.NOP}</td>
          <td>${normalizedRow.Nama_WP}</td>
          <td>${normalizedRow.Alamat_WP}</td>
          <td>${normalizedRow.Alamat_Objek}</td>
          <td class="num">${formatRupiah(normalizedRow.Pokok_PBB)}</td>
          <td><span class="status ${normalizedRow.Status.toLowerCase()}">${normalizedRow.Status}</span></td>
          <td>${normalizedRow.Tanggal_Bayar}</td>
          <td>${normalizedRow.Pemilik}</td>
          <td>${normalizedRow.Kolektor}</td>
          <td>${normalizedRow.Validasi}</td>
          <td>${normalizedRow.Keterangan}</td>
        `;
        tableBody.appendChild(tr);
      });

      loading.style.display = "none";
      table.style.display = "table";
    })
    .catch((err) => {
      loading.style.display = "none";
      errorDiv.style.display = "block";
      errorDiv.textContent = "Error: " + err.message;
      console.error("Error fetching data:", err);
    });
});

function formatRupiah(num) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
}