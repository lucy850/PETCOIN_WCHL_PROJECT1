document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbarMenu");
  const currentPage = window.location.pathname;

  // Ambil koleksi terbaru dari sessionStorage
  const koleksi = JSON.parse(sessionStorage.getItem("koleksiPet") || "[]");

  // Fungsi bikin class aktif
  const navClass = (page) =>
    currentPage.includes(page)
      ? "text-[#F9C0FF] border-b-2 border-[#F9C0FF] pb-1 font-semibold"
      : "hover:text-white pb-1 font-semibold text-gray-300";

  // Reset isi navbar
  navbar.innerHTML = `
    <a href="shop.html" class="${navClass('shop')}">Shop</a>
    <a href="gacha.html" class="${navClass('gacha')}">Gacha</a>
    <a href="about.html" class="${navClass('about')}">About</a>
    ${koleksi.length > 0 ? `<a href="collection.html" class="${navClass('collection')}">Collection</a>` : ""}
  `;
});

// Fungsi untuk beli hewan
function beliHewan(halamanTujuan, nama, harga) {
    let koleksi = JSON.parse(sessionStorage.getItem("koleksiPet") || "[]"); // DIUBAH

    if (koleksi.includes(nama)) {
        alert("Anda sudah memiliki hewan ini!");
        return false;
    }

    if (coins >= harga) {
        coins -= harga;
        sessionStorage.setItem("coins", coins); // DIUBAH
        updateCoinDisplay();

        if (!koleksi.includes(nama)) {
            koleksi.push(nama);
            sessionStorage.setItem("koleksiPet", JSON.stringify(koleksi)); // DIUBAH
        }

        window.location.href = halamanTujuan;
    } else {
        alert("Koin kamu tidak cukup!");
    }
    return false;
}


import { PetCoinBackend } from "../../../declarations/PetCoin_backend/PetCoin_backend.did.js";
const backendActor = PetCoinBackend;

// ==========================
// Fungsi donasi
// ==========================
async function donasi(amount) {
    try {
        const result = await backendActor.recordTopUp(amount);
        if ("ok" in result) {
            alert(`Donasi berhasil! Total koin kamu: ${result.ok.amount}`);
        } else {
            alert("Gagal menyimpan donasi: " + result.err);
        }
    } catch (err) {
        alert("Terjadi kesalahan saat donasi");
        console.error(err);
    }
}

// ==========================
// Event listener tombol donasi
// ==========================
document.getElementById("donateBtn")?.addEventListener("click", () => {
    const amount = 100; // Ganti sesuai input user atau tetap default
    donasi(amount);
});