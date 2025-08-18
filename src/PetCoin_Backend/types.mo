// ============================
// TYPES UNTUK PETCOIN BACKEND
// ============================

module Pet {

    // Struktur data pet
    public type Pet = {
        owner: Principal;
        name: Text;
        hunger: Nat;
    };

    // Riwayat top-up
    public type TopUpHistory = {
        amount: Nat;
    };

    // Riwayat donasi saat beli pet
    public type DonationHistory = {
        petName: Text;
        amount: Nat;
    };
};
