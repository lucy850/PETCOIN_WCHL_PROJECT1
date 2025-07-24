if (!localStorage.getItem("coins")) {
    localStorage.setItem("coins", "6000");
}
if (!localStorage.getItem("koleksiItem")) {
    localStorage.setItem("koleksiItem", JSON.stringify({}));
}
if (!localStorage.getItem("itemTerpasang")) {
    localStorage.setItem("itemTerpasang", JSON.stringify({}));
}

let coins = parseInt(localStorage.getItem("coins")) || 0;

function updateCoinDisplay() {
    const coinSpan = document.getElementById("coinDisplay");
    if (coinSpan) {
        coinSpan.textContent = coins.toLocaleString("id-ID");
    }
}

// Fungsi ini penting untuk dipanggil oleh file lain
function pakaiItem(namaItem, tipe) {
    let itemTerpasang = JSON.parse(localStorage.getItem("itemTerpasang")) || {};
    itemTerpasang[tipe] = namaItem;
    localStorage.setItem("itemTerpasang", JSON.stringify(itemTerpasang));
}

async function connectPlug() {
    const btn = document.getElementById("walletBtn");
    if (window.ic && window.ic.plug) {
        const connected = await window.ic.plug.requestConnect();
        if (connected) {
            const principalId = await window.ic.plug.getPrincipal();
            console.log("Connected to Plug:", principalId);
            btn.textContent = "Top Up";
            btn.onclick = showTopUpModal;
        } else {
            alert("Gagal connect ke Plug Wallet.");
        }
    } else {
        alert("Plug Wallet belum terpasang!");
    }
}

function showTopUpModal() {
    document.getElementById("topUpModal").classList.remove("hidden");
}

function closeTopUpModal() {
    document.getElementById("topUpModal").classList.add("hidden");
}

function topUp(amount) {
    coins += amount;
    localStorage.setItem("coins", coins);
    updateCoinDisplay();
    closeTopUpModal();
    alert(`Top up berhasil! Kamu mendapat ${amount} coin.`);
}

// Jalankan saat pertama kali dimuat untuk menampilkan koin awal
updateCoinDisplay();