// gacha.js

// Data item yang bisa didapat dari gacha
const gachaItems = [
    { id: "syal_gajah", name: "Elephant Scarf", image: "./png/syal gajah.png", type: "accessories" },
    { id: "topi_gajah", name: "Elephant Hat", image: "./png/topi gajah.png", type: "accessories" },
    { id: "kalung_gajah", name: "Elephant Necklace", image: "./png/kalung gajah.png", type: "accessories" },
    { id: "syal_kucing", name: "Cat Scarf", image: "./png/syal kucing.png", type: "accessories" },
    { id: "topi_kucing", name: "Cat Hat", image: "./png/topi kucing.png", type: "accessories" },
    { id: "kalung_kucing", name: "Cat Necklace", image: "./png/kalung kucing.png", type: "accessories" },
    { id: "syal_kelinci", name: "Rabbit Scarf", image: "./png/syal kelinci.png", type: "accessories" },
    { id: "topi_kelinci", name: "Rabbit Hat", image: "./png/topi kelinci.png", type: "accessories" },
    { id: "kalung_kelinci", name: "Rabbit Necklace", image: "./png/kalung kelinci.png", type: "accessories" },
    { id: "syal_beruang", name: "Bear Scarf", image: "./png/syal beruang.png", type: "accessories" },
    { id: "topi_beruang", name: "Bear Hat", image: "./png/topi beruang.png", type: "accessories" },
    { id: "kalung_beruang", name: "Bear Necklace", image: "./png/kalung beruang.png", type: "accessories" },
    { id: "syal_ayam", name: "Chicken Scarf", image: "./png/syal ayam.png", type: "accessories" },
    { id: "topi_ayam", name: "Chicken Hat", image: "./png/topi ayam.png", type: "accessories" },
    { id: "kalung_ayam", name: "Chicken Necklace", image: "./png/kalung ayam.png", type: "accessories" },
    { id: "racket", name: "Racket", image: "./png/racket.png", type: "playTools" },
    { id: "basket", name: "Basket", image: "./png/basket.png", type: "playTools" },
    { id: "fishing_gear", name: "Fishing Gear", image: "./png/pancingan.png", type: "playTools" },
    { id: "rambut_panjang_gajah", name: "Long Hair", image: "./png/long gajah.png", type: "hair" },
    { id: "rambut_curly_gajah", name: "Curly Hair", image: "./png/curly gajah.png", type: "hair" },
    { id: "rambut_short_gajah", name: "Short Hair", image: "./png/short gajah.png", type: "hair" },
    { id: "rambut_panjang_kucing", name: "Long Cat Hair", image: "./png/panjang kucing.png", type: "hair" },
    { id: "rambut_curly_kucing", name: "Curly Cat Hair", image: "./png/curly kucing.png", type: "hair" },
    { id: "rambut_short_kucing", name: "Short Cat Hair", image: "./png/pendek kucing.png", type: "hair" },
    { id: "rambut_panjang_kelinci", name: "Rabbit Long Hair", image: "./png/long kelinci.png", type: "hair" },
    { id: "rambut_curly_kelinci", name: "Rabbit Curly Hair", image: "./png/curly kelinci.png", type: "hair" },
    { id: "rambut_short_kelinci", name: "Rabbit Short Hair", image: "./png/short kelinci.png", type: "hair" },
    { id: "rambut_panjang_beruang", name: "Long Bear Hair", image: "./png/long beruang.png", type: "hair" },
    { id: "rambut_curly_beruang", name: "Curly Bear Hair", image: "./png/curly beruang.png", type: "hair" },
    { id: "rambut_short_beruang", name: "Short Bear Hair", image: "./png/short beruang.png", type: "hair" },
    { id: "rambut_panjang_ayam", name: "Chicken Long Hair", image: "./png/long ayam.png", type: "hair" },
    { id: "rambut_curly_ayam", name: "Chicken Curly Hair", image: "./png/curly ayam.png", type: "hair" },
    { id: "rambut_short_ayam", name: "Chicken Short Hair", image: "./png/short ayam.png", type: "hair" },
];

const GACHA_COST = 200;

function showGachaResultModal(item) {
    const modal = document.getElementById("gachaResultModal");
    document.getElementById("gachaResultImage").src = item.image;
    document.getElementById("gachaResultName").textContent = item.name;
    modal.classList.remove("hidden");
}

function closeGachaResultModal() {
    const modal = document.getElementById("gachaResultModal");
    modal.classList.add("hidden");
    // Refresh tampilan
    window.location.reload();
}

function performGacha() {
    let coins = parseInt(sessionStorage.getItem("coins")) || 0;
    if (coins < GACHA_COST) {
        alert("❌ Koinmu tidak cukup untuk melakukan Gacha!");
        return;
    }

    coins -= GACHA_COST;
    sessionStorage.setItem("coins", String(coins));
    if (typeof updateCoinDisplay === "function") {
        updateCoinDisplay();
    }

    // Pilih item secara acak
    const randomIndex = Math.floor(Math.random() * gachaItems.length);
    const wonItem = gachaItems[randomIndex];

    // Ambil koleksi dari sessionStorage
    let koleksiItem = JSON.parse(sessionStorage.getItem("koleksiItem")) || {};

    if (!koleksiItem[wonItem.type]) {
        koleksiItem[wonItem.type] = [];
    }

    // Simpan berdasarkan id supaya unik
    if (!koleksiItem[wonItem.type].some(item => item.id === wonItem.id)) {
        koleksiItem[wonItem.type].push(wonItem);
    }

    // Simpan kembali koleksi
    sessionStorage.setItem("koleksiItem", JSON.stringify(koleksiItem));

    // Kalau mau langsung dipakai ke hewan
    if (typeof pakaiItem === "function") {
        pakaiItem(wonItem.image, wonItem.type);
    }

    // Tampilkan hasil gacha
    showGachaResultModal(wonItem);
}