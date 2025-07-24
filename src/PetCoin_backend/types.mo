// src/PetCoin_backend/types.mo
import Principal "mo:base/Principal";

type Pet = {
    owner: Principal;
    name: Text;
    hunger: Nat;
};
