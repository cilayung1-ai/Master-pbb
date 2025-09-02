document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.getElementById("table-body");
  const loading = document.getElementById("loading");
  const errorDiv = document.getElementById("error");
  const table = document.getElementById("pbb-table");

  // GANTI DENGAN URL WEB APP ANDA
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxZsWerzm0vm_jCo2-FyqqaJYUvwNSryYtY03d0UUDPktf8jUO2CFdv7GQavjubBffwVQ/exec";

  fetch(WEB_APP_URL)
    .then(res => res.json())
    .then(json => {
      if (json.error) {
        throw new Error(json.error);
      }

      json.data.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.NOP || "-"}</td>
          <td>${row.Nama_WP || "-"}</td>
          <td>${row.Alamat_WP || "-"}</td>
          <td>${row.Alamat_Objek || "-"}</td>
          <td>${formatRupiah(row.Pokok_PBB || "0")}</td>
          <td><span class="status ${row.Status?.toLowerCase().replace(/\s+/g, '-') || ''}">${row.Status || "-"}</span></td>
          <td>${formatDate(row.Tanggal_Bayar)}</td>
          <td>${row.Pemilik || "-"}</td>
          <td>${row.Kolektor || "-"}</td>
          <td>${row.Validasi || "-"}</td>
          <td>${row.KET || "-"}</td>
        `;
        tableBody.appendChild(tr);
      });

      loading.style.display = "none";
      table.style.display = "table";
    })
    .catch(err => {
      loading.style.display = "none";
      errorDiv.style.display = "block";
      errorDiv.textContent = "Error: " + err.message;
    });
});

function formatRupiah(num) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return isNaN(date) ? dateStr : date.toLocaleDateString("id-ID");

}
