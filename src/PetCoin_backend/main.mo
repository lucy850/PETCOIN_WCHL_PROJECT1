// src/PetCoin_backend/main.mo

// Mengimpor semua library dan tipe data yang dibutuhkan
import Pet "types";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Result "mo:base/Result"; // <-- PERBAIKAN 1: Menambahkan import Result

actor PetCoinBackend {

    // Variabel untuk menyimpan data pet
    // PERBAIKAN 2 & 3: Menggunakan HashMap.new() dan menghilangkan 'stable'
    private var pets: HashMap.HashMap<Principal, Pet.Pet> = HashMap.new();

    // Fungsi untuk membuat pet (hanya bisa sekali)
    public func createFirstPet(name: Text) : async Result.Result<Pet.Pet, Text> {
        let caller = Principal.fromActor(this);
        if (pets.get(caller) != null) {
            return Result.Err("Anda sudah memiliki pet!");
        };
        if (name.size() == 0) {
            return Result.Err("Nama tidak boleh kosong.");
        };
        let newPet: Pet.Pet = {
            owner = caller;
            name = name;
            hunger = 100;
        };
        pets.put(caller, newPet);
        return Result.Ok(newPet);
    };

    // Fungsi untuk mengambil data pet milik sendiri
    public query func getMyPet() : async ?Pet.Pet {
        let caller = Principal.fromActor(this);
        return pets.get(caller);
    };
}
