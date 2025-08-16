// =======================
// INISIALISASI DATA AWAL (MENGGUNAKAN sessionStorage)
// =======================
if (!sessionStorage.getItem("coins")) {
    sessionStorage.setItem("coins", "6000");
}
if (!sessionStorage.getItem("koleksiItem")) {
    sessionStorage.setItem("koleksiItem", JSON.stringify({}));
}
if (!sessionStorage.getItem("itemTerpasang")) {
    sessionStorage.setItem("itemTerpasang", JSON.stringify({}));
}
if (!sessionStorage.getItem("koleksiPet")) {
    sessionStorage.setItem("koleksiPet", JSON.stringify([]));
}

let coins = parseInt(sessionStorage.getItem("coins")) || 0;

// ============================
// INTERFACE LEDGER ICP
// ============================
const ledgerIDL = ({ IDL }) => {
  return IDL.Service({
    account_balance_dfx: IDL.Func(
      [
        {
          account: IDL.Record({
            owner: IDL.Principal,
            subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
          }),
        },
      ],
      [IDL.Record({ e8s: IDL.Nat64 })],
      ["query"]
    ),
  });
};

// ============================
// INTERFACE CPHW TOKEN CANISTER
// ============================
const cphwIDL = ({ IDL }) => {
  return IDL.Service({
    topUp: IDL.Func([IDL.Nat], [], []),
    transfer: IDL.Func([IDL.Principal, IDL.Nat], [IDL.Bool], []),
    balanceOf: IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
  });
};

// ============================
// INTEGRASI PETCOIN BACKEND CANISTER
// ============================
const backendIDL = ({ IDL }) => {
    return IDL.Service({
        createFirstPet: IDL.Func(
            [IDL.Text], 
            [IDL.Variant({ "#ok": IDL.Record({ owner: IDL.Principal, name: IDL.Text, hunger: IDL.Nat }), "#err": IDL.Text })], 
            []
        ),
        getMyPet: IDL.Func([], [IDL.Opt(IDL.Record({ owner: IDL.Principal, name: IDL.Text, hunger: IDL.Nat }))], ['query']),
        topUp: IDL.Func([IDL.Nat], [IDL.Variant({ "#ok": IDL.Nat, "#err": IDL.Text })], []),
        getTopUp: IDL.Func([], [IDL.Nat], ['query']),
        addItem: IDL.Func([IDL.Text, IDL.Text], [], []),
        pakaiItem: IDL.Func([IDL.Text, IDL.Text], [], []),
        getAllItems: IDL.Func([], [IDL.Variant({ "#ok": IDL.Record({}) })], ['query']),
    });
};

const PETCOIN_BACKEND_CANISTER = "PUT_CANISTER_ID_HERE"; // ganti dengan canister kamu

// ============================
// FUNGSI CEK SALDO ICP
// ============================
async function getICPSaldo() {
  try {
    const principal = await window.ic.plug.getPrincipal();

    const ledger = await window.ic.plug.createActor({
      canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
      interfaceFactory: ledgerIDL(window.ic.plug.IDL),
    });

    const result = await ledger.account_balance_dfx({
      account: {
        owner: principal,
        subaccount: [],
      },
    });

    return Number(result.e8s) / 100_000_000;
  } catch (err) {
    console.error("Gagal cek saldo ICP:", err);
    return 0;
  }
}

// ============================
// LOADING OVERLAY
// ============================
function showLoading(message) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.querySelector('p').textContent = message;
        overlay.classList.remove('hidden');
        overlay.classList.add('flex', 'flex-col');
    }
}
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
        overlay.classList.remove('flex', 'flex-col');
    }
}

// ============================
// CONNECT PLUG WALLET
// ============================
async function handleConnection() {
    const btn = document.getElementById("connectBtn");
    if (!window.ic || !window.ic.plug) {
        alert("Plug Wallet tidak ditemukan.");
        window.open('https://plugwallet.ooo/', '_blank');
        return;
    }
    btn.disabled = true;
    showLoading("Menghubungkan ke Wallet...");
    try {
        await window.ic.plug.requestConnect({
            whitelist: [],
            host: "https://icp0.io",
        });

        if (await window.ic.plug.isConnected()) {
            const principalId = await window.ic.plug.getPrincipal();
            sessionStorage.setItem('plugConnected', 'true');
            sessionStorage.setItem('principalId', principalId.toText());

            // ======================
            // SYNC OTOMATIS KE BACKEND
            // ======================
            await syncBackendAfterConnect(principalId);

            window.location.href = 'shop.html';
        } else {
            throw new Error("Koneksi tidak berhasil diverifikasi.");
        }
    } catch (error) {
        alert("Koneksi gagal: " + error.message);
    } finally {
        hideLoading();
        btn.disabled = false;
    }
}

// ============================
// TOP-UP & SYNC BACKEND
// ============================
async function topUp(amount) {
    const ALAMAT_PENERIMA = 'etxmz-m6pfj-ols34-3oatd-obisr-ywiok-6dssr-gf5jo-5ln6f-rak52-iae';
    const CPHW_CANISTER_ID = 'ulvla-h7777-77774-qaacq-cai';
    closeTopUpModal();
    showLoading("Memverifikasi koneksi wallet...");
    try {
        if (!(await window.ic.plug.isConnected())) {
            await window.ic.plug.requestConnect({ whitelist: [CPHW_CANISTER_ID] });
        }

        const saldo = await getICPSaldo();
        const priceInICP = amount * 0.001;

        if (saldo < priceInICP) {
            hideLoading();
            alert("❌ Saldo ICP tidak cukup untuk top up.");
            return;
        }

        const priceInE8s = BigInt(Math.floor(priceInICP * 100_000_000)).toString();

        showLoading("Menunggu persetujuan di Plug Wallet...");
        const result = await window.ic.plug.requestTransfer({
            to: ALAMAT_PENERIMA,
            amount: priceInE8s,
        });

        if (result && result.height) {
            coins += amount;
            sessionStorage.setItem("coins", String(coins));
            updateCoinDisplay();

            showLoading("Sinkronisasi ke canister...");
            const actor = await window.ic.plug.createActor({
                canisterId: CPHW_CANISTER_ID,
                interfaceFactory: cphwIDL(window.ic.plug.IDL),
            });
            await actor.topUp(BigInt(amount));

            const backendActor = await window.ic.plug.createActor({
                canisterId: PETCOIN_BACKEND_CANISTER,
                interfaceFactory: backendIDL(window.ic.plug.IDL),
            });
            await backendActor.topUp(BigInt(amount));

            hideLoading();
            alert(`🎉 Berhasil! Kamu mendapatkan ${amount} coin.`);
        } else {
            throw new Error("Transaksi dibatalkan atau gagal.");
        }
    } catch (err) {
        console.error("Top up gagal:", err);
        hideLoading();
        alert(`❌ Top up gagal: ${err.message}`);
    }
}

// ============================
// MODAL & UI COIN
// ============================
function updateCoinDisplay() {
    const coinSpan = document.getElementById("coinDisplay");
    if (coinSpan) {
        coinSpan.textContent = coins.toLocaleString("id-ID");
    }
}
function showTopUpModal() {
    const modal = document.getElementById("topUpModal");
    if (modal) modal.classList.remove('hidden');
}
function closeTopUpModal() {
    const modal = document.getElementById("topUpModal");
    if (modal) modal.classList.add('hidden');
}

// ============================
// TOMBOL WALLET
// ============================
function initializeWalletButton() {
    const walletBtn = document.getElementById('walletBtn');
    const isConnected = sessionStorage.getItem('plugConnected') === 'true';
    if (!walletBtn) return;

    if (isConnected) {
        walletBtn.textContent = "Top Up";
        walletBtn.onclick = showTopUpModal;
    } else {
        walletBtn.textContent = "Connect Wallet";
        walletBtn.onclick = () => window.location.href = 'connect.html';
    }
}

// ============================
// LOAD SAAT PAGE DIBUKA
// ============================
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname;
    if (sessionStorage.getItem('plugConnected') !== 'true' && !currentPage.includes('connect.html')) {
        window.location.href = 'connect.html';
        return;
    }
    updateCoinDisplay();
    initializeWalletButton();
});

// ============================
// FUNGSI PASANG ITEM (KOLEKSI)
// ============================
function pakaiItem(namaItem, tipe) {
    let itemTerpasang = JSON.parse(sessionStorage.getItem("itemTerpasang")) || {};
    itemTerpasang[tipe] = namaItem;
    sessionStorage.setItem("itemTerpasang", JSON.stringify(itemTerpasang));
}

// ============================
// SYNC BACKEND SETELAH CONNECT
// ============================
async function syncBackendAfterConnect(principalId) {
    try {
        const actor = await window.ic.plug.createActor({
            canisterId: PETCOIN_BACKEND_CANISTER,
            interfaceFactory: backendIDL(window.ic.plug.IDL),
        });

        // Sinkronisasi saldo dari backend
        const backendSaldo = await actor.getTopUp();
        coins = Number(backendSaldo);
        sessionStorage.setItem("coins", String(coins));
        updateCoinDisplay();

        // Ambil pet user
        const myPet = await actor.getMyPet();
        if (myPet && "#ok" in myPet) {
            let koleksi = JSON.parse(sessionStorage.getItem("koleksiPet") || "[]");
            if (!koleksi.includes(myPet["#ok"].name)) {
                koleksi.push(myPet["#ok"].name);
                sessionStorage.setItem("koleksiPet", JSON.stringify(koleksi));
            }
        }
    } catch (err) {
        console.error("Sync ke backend gagal:", err);
    }
}

// ============================
// Beli Pet & Sync Backend
// ============================
async function beliPetBackend(namaPet) {
    try {
        const backendActor = await window.ic.plug.createActor({
            canisterId: PETCOIN_BACKEND_CANISTER,
            interfaceFactory: backendIDL(window.ic.plug.IDL),
        });

        const result = await backendActor.createFirstPet(namaPet);

        if ("#ok" in result) {
            let koleksi = JSON.parse(sessionStorage.getItem("koleksiPet") || "[]");
            if (!koleksi.includes(namaPet)) {
                koleksi.push(namaPet);
                sessionStorage.setItem("koleksiPet", JSON.stringify(koleksi));
            }
            alert(`🎉 Kamu berhasil punya ${namaPet}!`);
        } else {
            alert(result["#err"]);
        }
    } catch (err) {
        console.error("Beli pet gagal:", err);
        alert("❌ Gagal beli pet!");
    }
}

// ============================
// Tambah Koleksi Item Backend
// ============================
async function tambahKoleksiItem(tipe, namaItem) {
    try {
        const backendActor = await window.ic.plug.createActor({
            canisterId: PETCOIN_BACKEND_CANISTER,
            interfaceFactory: backendIDL(window.ic.plug.IDL),
        });
        await backendActor.addItem(tipe, namaItem);

        let koleksiItem = JSON.parse(sessionStorage.getItem("koleksiItem") || "{}");
        if (!koleksiItem[tipe]) koleksiItem[tipe] = [];
        if (!koleksiItem[tipe].includes(namaItem)) {
            koleksiItem[tipe].push(namaItem);
        }
        sessionStorage.setItem("koleksiItem", JSON.stringify(koleksiItem));
    } catch (err) {
        console.error("Tambah koleksi item gagal:", err);
        alert("❌ Gagal tambah item!");
    }
}

// ============================
// Pakai Item Backend
// ============================
async function pakaiItemBackend(tipe, namaItem) {
    try {
        const backendActor = await window.ic.plug.createActor({
            canisterId: PETCOIN_BACKEND_CANISTER,
            interfaceFactory: backendIDL(window.ic.plug.IDL),
        });
        await backendActor.pakaiItem(tipe, namaItem);

        let itemTerpasang = JSON.parse(sessionStorage.getItem("itemTerpasang") || "{}");
        itemTerpasang[tipe] = namaItem;
        sessionStorage.setItem("itemTerpasang", JSON.stringify(itemTerpasang));
    } catch (err) {
        console.error("Pakai item gagal:", err);
        alert("❌ Gagal pakai item!");
    }
}

// ============================
// Sinkronisasi koleksi item dari backend
// ============================
async function syncKoleksiItem() {
    try {
        const backendActor = await window.ic.plug.createActor({
            canisterId: PETCOIN_BACKEND_CANISTER,
            interfaceFactory: backendIDL(window.ic.plug.IDL),
        });

        const allItemsResult = await backendActor.getAllItems();
        if ("#ok" in allItemsResult) {
            sessionStorage.setItem("koleksiItem", JSON.stringify(allItemsResult["#ok"]));
        }
    } catch (err) {
        console.error("Sync koleksi item gagal:", err);
    }
}
