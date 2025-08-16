const petImage = document.getElementById("petImage");
const happyBar = document.getElementById("happyBar");
const hungryBar = document.getElementById("hungryBar");
const accessoryOverlay = document.getElementById("accessoryOverlay");
const playToolOverlay = document.getElementById("playToolOverlay");
const hairOverlay = document.getElementById("hairOverlay");

let happy = parseInt(sessionStorage.getItem("happyChicken")) || 100;
let hungry = parseInt(sessionStorage.getItem("hungryChicken")) || 100;
let ekspresiTimeout = null;

const ekspresiChicken = {
    normal: "./png/Ayam.png",
    love: "./png/ayam love.png",
    sad: "./png/ayam sedih.png"
};

const itemData = {
    hair: [
        { name: "Long Chicken Hair", price: 300, image: "./png/long ayam.png" },
        { name: "Curly Chicken Hair", price: 300, image: "./png/curly ayam.png" },
        { name: "Short Chicken Hair", price: 300, image: "./png/short ayam.png" }
    ],
    accessories: [
        { name: "Chicken Scarf", price: 300, image: "./png/syal ayam.png" }, // Adjusted image path
        { name: "Chicken Hat", price: 300, image: "./png/hat ayam.png" }, // Adjusted image path
        { name: "Chicken Necklace", price: 300, image: "./png/kalung ayam.png" } // Adjusted image path
    ],
    playTools: [
        { name: "Racket", price: 300, image: "./png/racket.png" },
        { name: "Basket", price: 300, image: "./png/basket.png" },
        { name: "Fishing Gear", price: 300, image: "./png/pancingan.png" }
    ]
};

function updateBars() {
    happyBar.style.width = happy + "%";
    hungryBar.style.width = hungry + "%";

    if (hungry > 75) {
        hungryBar.classList.remove("bg-yellow-400", "bg-red-400");
        hungryBar.classList.add("bg-green-400");
    } else if (hungry > 25) {
        hungryBar.classList.remove("bg-green-400", "bg-red-400");
        hungryBar.classList.add("bg-yellow-400");
    } else {
        hungryBar.classList.remove("bg-green-400", "bg-yellow-400");
        hungryBar.classList.add("bg-red-400");
    }

    if (happy <= 20 || hungry <= 20) {
        showExpression("sad");
    } else if (!ekspresiTimeout) {
        showExpression("normal");
    }
    
    sessionStorage.setItem("happyChicken", happy);
    sessionStorage.setItem("hungryChicken", hungry);
}

function showExpression(type, duration = 0) {
    if (ekspresiTimeout) {
        clearTimeout(ekspresiTimeout);
        ekspresiTimeout = null;
    }

    const terpasang = JSON.parse(sessionStorage.getItem("itemTerpasangChicken")) || {};
    let gambarFinal = ekspresiChicken[type]; // Changed from ekspresiBear to ekspresiChicken

    if (terpasang.hair) {
        const itemRambut = itemData.hair.find(i => i.name === terpasang.hair);
        if (itemRambut) {
            if (type === 'love') {
                gambarFinal = itemRambut.image.replace('.png', ' seneng.png');
            } else if (type === 'sad') {
                gambarFinal = itemRambut.image.replace('.png', ' sedih.png');
            } else {
                gambarFinal = itemRambut.image;
            }
        }
    }
    
    petImage.src = gambarFinal;

    if (type === "love") {
        ekspresiTimeout = setTimeout(() => {
            ekspresiTimeout = null;
            if (happy <= 20 || hungry <= 20) {
                showExpression("sad");
            } else {
                showExpression("normal");
            }
        }, duration);
    }
    tampilkanItemTerpasang();
}

function tampilkanItemTerpasang() {
    const terpasang = JSON.parse(sessionStorage.getItem("itemTerpasangChicken")) || {};
    hairOverlay.classList.add("hidden");
    accessoryOverlay.classList.add("hidden");
    playToolOverlay.classList.add("hidden");

    const findItemImage = (tipe, nama) => {
        const item = itemData[tipe].find(i => i.name === nama);
        return item ? item.image : null;
    };
    
    if (terpasang.hair) {
      const hairImage = findItemImage('hair', terpasang.hair);
      if (hairImage) {
        hairOverlay.src = hairImage;
        hairOverlay.classList.remove("hidden");
      }
    }
    if (terpasang.accessories) {
        const accessoryImage = findItemImage('accessories', terpasang.accessories);
        if (accessoryImage) {
            accessoryOverlay.src = accessoryImage;
            accessoryOverlay.classList.remove("hidden");
        }
    }
    if (terpasang.playTools) {
        const playToolImage = findItemImage('playTools', terpasang.playTools);
        if (playToolImage) {
            playToolOverlay.src = playToolImage;
            playToolOverlay.classList.remove("hidden");
        }
    }
}

function bounceOnce() {
    showExpression("love", 1500);
    const elementsToBounce = [petImage, hairOverlay, accessoryOverlay, playToolOverlay];
    elementsToBounce.forEach(el => {
        el.classList.remove("animate-bounce");
        void el.offsetWidth;
        el.classList.add("animate-bounce");
    });
    setTimeout(() => {
        elementsToBounce.forEach(el => {
            el.classList.remove("animate-bounce");
        });
    }, 1500);
}

function showHearts() {
    const petImage = document.getElementById('petImage');
    const petImageRect = petImage.getBoundingClientRect();
    const heartCount = 15;
    const heartEmoji = '❤️';

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = heartEmoji;
        heart.classList.add('heart-particle');
        
        const x = petImageRect.left + (Math.random() * petImageRect.width);
        const y = petImageRect.top + (Math.random() * petImageRect.height * 0.4);
        
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        heart.style.animationDelay = `${Math.random() * 0.5}s`;
        
        document.body.appendChild(heart);

        heart.addEventListener('animationend', () => {
            heart.remove();
        });
    }
}

petImage.addEventListener("click", () => {
    if (hungry <= 20 && happy <= 20) return;
    happy = Math.min(happy + 10, 100);
    updateBars();
    bounceOnce();
    showHearts();
});

function feedPet() {
    const hargaMakanan = 30; 
    if (typeof coins !== 'undefined' && coins >= hargaMakanan) {
        coins -= hargaMakanan;
        sessionStorage.setItem("coins", coins);
        updateCoinDisplay();

        hungry = Math.min(hungry + 20, 100);
        updateBars();
        
        bounceOnce();
        showHearts();
    } else {
        alert("Koin kamu tidak cukup untuk membeli makanan!");
    }
}

const decayRate = 100 / (4 * 60 * 60 * 1000 / 10000); 
setInterval(() => {
    hungry = Math.max(hungry - decayRate, 0);
    happy = Math.max(happy - decayRate, 0);
    updateBars();
}, 10000);

function petPet() {
    const hint = document.getElementById("petHint");
    hint.style.opacity = "0";
    setTimeout(() => {
        hint.style.opacity = "1";
    }, 1500);
    showHearts();
}

function lepasItem(tipe) {
    const terpasang = JSON.parse(sessionStorage.getItem("itemTerpasangChicken")) || {};
    delete terpasang[tipe]; 
    sessionStorage.setItem("itemTerpasangChicken", JSON.stringify(terpasang));
    showExpression("normal");
    const modalId = `${tipe}Modal`;
    document.getElementById(modalId).classList.add('hidden');
}

function handleItemAction(itemName, itemPrice, itemType, sudahDibeli) {
    const modalId = `${itemType}Modal`;
    const modal = document.getElementById(modalId);
    if (sudahDibeli) {
        pakaiItem(itemName, itemType);
        showExpression("normal"); 
        modal.classList.add('hidden');
    } else {
        if (typeof coins !== 'undefined' && coins >= itemPrice) {
            coins -= itemPrice;
            updateCoinDisplay();
            sessionStorage.setItem("coins", coins); 
            
            let koleksi = JSON.parse(sessionStorage.getItem("koleksiItemChicken")) || {};
            if (!koleksi[itemType]) {
                koleksi[itemType] = [];
            }
            if (!koleksi[itemType].includes(itemName)) {
                koleksi[itemType].push(itemName);
                sessionStorage.setItem("koleksiItemChicken", JSON.stringify(koleksi));
            }
            pakaiItem(itemName, itemType);
            bounceOnce();
            alert(`${itemName} berhasil dibeli dan dipakai!`);
            modal.classList.add('hidden');
        } else {
            alert("Koin kamu tidak cukup!");
        }
    }
}

function pakaiItem(itemName, itemType) {
    let terpasang = JSON.parse(sessionStorage.getItem("itemTerpasangChicken")) || {};
    terpasang[itemType] = itemName;
    sessionStorage.setItem("itemTerpasangChicken", JSON.stringify(terpasang));
    tampilkanItemTerpasang();
}

function populateShopModal(type) {
    const container = document.getElementById(`${type}Items`);
    const terpasang = JSON.parse(sessionStorage.getItem("itemTerpasangChicken")) || {};
    const koleksi = JSON.parse(sessionStorage.getItem("koleksiItemChicken")) || {};
    
    container.innerHTML = "";
    
    const items = itemData[type];
    
    if (!items || items.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-400">Item tidak tersedia.</p>';
        return;
    }
    
    container.innerHTML += `
        <div class="bg-[#2c2560] border-2 border-dashed border-gray-500 rounded-xl p-4 flex flex-col justify-between">
            <div>
                <p class="text-white font-semibold text-lg mb-2">Normal</p>
                <p class="text-xs text-gray-400">Kembali ke tampilan awal</p>
            </div>
            <button onclick="lepasItem('${type}')" class="mt-4 bg-gray-600 hover:bg-gray-700 w-full px-4 py-2 rounded-full text-white font-semibold">
                Pakai
            </button>
        </div>
    `;
    
    items.forEach(item => {
        const sudahDibeli = koleksi[type] && koleksi[type].includes(item.name);
        const sedangDipakai = terpasang[type] === item.name;

        let buttonText = sudahDibeli ? (sedangDipakai ? 'Dipakai' : 'Pakai') : 'Beli';
        let buttonClass = 'mt-2 w-full px-4 py-2 rounded-full text-white font-semibold transition-colors';

        if (sedangDipakai) {
            buttonClass += ' bg-green-600 cursor-default';
        } else if (sudahDibeli) {
            buttonClass += ' bg-blue-600 hover:bg-blue-700';
        } else {
            buttonClass += ' bg-purple-600 hover:bg-purple-700';
        }

        const itemHTML = `
            <div class="bg-[#1a1046] rounded-xl p-4 flex flex-col justify-between">
                <div>
                    <p class="text-yellow-300 text-lg mb-2">${item.name}</p>
                    <div class="flex justify-center gap-1 mb-4">
                        <img src="./png/coin.png" class="w-5 h-5" />
                        <span class="text-yellow-400 text-sm">${item.price}</span>
                    </div>
                </div>
                <button onclick="handleItemAction('${item.name}', ${item.price}, '${type}', ${sudahDibeli})" 
                    class="${buttonClass}" ${sedangDipakai ? 'disabled' : ''}>
                    ${buttonText}
                </button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', itemHTML);
    });
}

window.addEventListener("DOMContentLoaded", () => {
    const modals = {
        hair: document.getElementById('hairModal'),
        accessories: document.getElementById('accessoriesModal'),
        playTools: document.getElementById('playToolsModal')
    };

    document.getElementById('openHairModal').addEventListener('click', () => {
        populateShopModal('hair');
        modals.hair.classList.remove('hidden');
    });
    document.getElementById('openAccessoriesModal').addEventListener('click', () => {
        populateShopModal('accessories');
        modals.accessories.classList.remove('hidden');
    });
    document.getElementById('openPlayToolsModal').addEventListener('click', () => {
        populateShopModal('playTools');
        modals.playTools.classList.remove('hidden');
    });
    
    document.getElementById('closeHairModal').addEventListener('click', () => modals.hair.classList.add('hidden'));
    document.getElementById('closeAccessoriesModal').addEventListener('click', () => modals.accessories.classList.add('hidden'));
    document.getElementById('closePlayToolsModal').addEventListener('click', () => modals.playTools.classList.add('hidden'));
    
    updateBars();
    showExpression("normal");
});