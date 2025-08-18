import Pet "types";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Array "mo:base/Array";

actor PetCoinBackend {

    // =====================
    // STORAGE
    // =====================
    private var topUps = HashMap.HashMap<Principal, [Pet.TopUpHistory]>(10, Principal.equal, Principal.hash);
    private var petDonations = HashMap.HashMap<Principal, [Pet.DonationHistory]>(10, Principal.equal, Principal.hash);
    
    // Tambahan storage untuk login user
    private var users = HashMap.HashMap<Principal, { username: Text; bio: Text }>(10, Principal.equal, Principal.hash);

    // =====================
    // TOP-UP
    // =====================
    public shared (msg) func topUp(amount: Nat) : async { #ok: Nat; #err: Text } {
        let caller = msg.caller;
        if (amount == 0) return #err("Jumlah top-up harus lebih dari 0");

        // ambil riwayat lama
        let oldList = switch (topUps.get(caller)) { case (?r) r; case null [] };
        let newEntry: Pet.TopUpHistory = { amount = amount };
        let newList = Array.append(oldList, [newEntry]);
        topUps.put(caller, newList);

        return #ok(amount);
    };

    // =====================
    // GET RIWAYAT TOP-UP
    // =====================
    public shared query (msg) func getTopUpHistory() : async [Pet.TopUpHistory] {
        switch (topUps.get(msg.caller)) { case (?r) r; case null [] };
    };

    // =====================
    // RIWAYAT DONASI PET
    // =====================
    public shared (msg) func recordDonation(petName: Text, amount: Nat) : async { #ok: Nat; #err: Text } {
        let caller = msg.caller;
        if (amount == 0) return #err("Jumlah donasi harus lebih dari 0");

        let oldList = switch (petDonations.get(caller)) { case (?r) r; case null [] };
        let newEntry: Pet.DonationHistory = { petName = petName; amount = amount };
        let newList = Array.append(oldList, [newEntry]);
        petDonations.put(caller, newList);

        return #ok(amount);
    };

    public shared query (msg) func getPetDonationHistory() : async [Pet.DonationHistory] {
        switch (petDonations.get(msg.caller)) { case (?r) r; case null [] };
    };

    // =====================
    // LOGIN / REGISTER USER
    // =====================
    public shared (msg) func login(username: Text, bio: Text) : async { #ok: Text; #err: Text } {
        let caller = msg.caller;

        if (username.size() == 0) return #err("Username tidak boleh kosong.");

        users.put(caller, { username = username; bio = bio });

        return #ok("User berhasil login / tersimpan");
    };

    // =====================
    // AMBIL DATA USER
    // =====================
    public shared query (msg) func getUser() : async ?{ username: Text; bio: Text } {
        return users.get(msg.caller);
    };
};
