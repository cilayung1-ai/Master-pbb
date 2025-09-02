const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxZsWerzm0vm_jCo2-FyqqaJYUvwNSryYtY03d0UUDPktf8jUO2CFdv7GQavjubBffwVQ/exec";

document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.getElementById("table-body");
  const loading = document.getElementById("loading");
  const errorDiv = document.getElementById("error");
  const table = document.getElementById("pbb-table");

  // Tampilkan pesan info
  loading.textContent = "Menghubungkan ke server...";

  fetch(WEB_APP_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(text => {
      try {
        const json = JSON.parse(text);
        
        // Periksa apakah ada error
        if (json.status === "error") {
          throw new Error(json.message);
        }

        // Pastikan data valid
        if (!json.data || !Array.isArray(json.data)) {
          throw new Error("Format data tidak valid. Pastikan GAS tidak error.");
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
            Tanggal_Bayar: row.Tanggal_Bayar || "-",
            Pemilik: row.Pemilik || "-",
            Kolektor: row.Kolektor || "-",
            Validasi: row.Validasi || "-",
            KET: row.KET || "-"
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
            <td>${formatDate(normalizedRow.Tanggal_Bayar)}</td>
            <td>${normalizedRow.Pemilik}</td>
            <td>${normalizedRow.Kolektor}</td>
            <td>${normalizedRow.Validasi}</td>
            <td>${normalizedRow.KET}</td>
          `;
          tableBody.appendChild(tr);
        });

        loading.style.display = "none";
        table.style.display = "table";
      } catch (parseError) {
        throw new Error("GAS Error: " + text.substring(0, 200));
      }
    })
    .catch((err) => {
      loading.style.display = "none";
      errorDiv.style.display = "block";
      errorDiv.textContent = "GAGAL MEMUAT DATA: " + err.message;
      console.error("Error fetching ", err);
    });
});

function formatRupiah(num) {
  // Pastikan num adalah angka
  const value = typeof num === 'number' ? num : parseFloat(num) || 0;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  
  try {
    // Coba sebagai timestamp
    if (!isNaN(Date.parse(dateStr))) {
      return new Date(dateStr).toLocaleDateString("id-ID");
    }
    
    // Coba sebagai format spreadsheet
    if (typeof dateStr === 'number') {
      const date = new Date((dateStr - (25567 + 2)) * 86400 * 1000);
      return date.toLocaleDateString("id-ID");
    }
    
    return dateStr;
  } catch (e) {
    return dateStr;
  }
}