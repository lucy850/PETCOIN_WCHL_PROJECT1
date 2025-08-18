import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as PetCoinBackendIDL } from "../../../declarations/PetCoin_backend/PetCoin_backend.did.js";
; // pastikan path benar

document.addEventListener("DOMContentLoaded", async () => {
    const loginButton = document.getElementById("internet-identity-login-button");

    if (!loginButton) {
        console.error("Tombol login tidak ditemukan di halaman.");
        return;
    }

    const authClient = await AuthClient.create();

    // Fungsi bikin actor backend langsung
    async function getBackendActor(identity) {
        const agent = new HttpAgent({ identity });
        // Ganti localhost/IC sesuai environment
        agent.fetchRootKey(); // hanya untuk lokal dev
        return Actor.createActor(PetCoinBackendIDL, {
            agent,
            canisterId: "PUT_CANISTER_ID_HERE"
        });
    }

    if (await authClient.isAuthenticated()) {
        const identity = authClient.getIdentity();
        console.log("Sudah login:", identity.getPrincipal().toText());

        loginButton.textContent = "Logout";
        loginButton.onclick = async () => {
            await authClient.logout();
            loginButton.textContent = "Login"; // 🔥 tombol balik jadi Login
            location.reload();
        };
        return;
    }

    loginButton.textContent = "Login";
    loginButton.addEventListener("click", async () => {
        console.log("Tombol login diklik ✅");

        await authClient.login({
            identityProvider: "https://identity.ic0.app/#authorize",
            onSuccess: async () => {
                console.log("✅ Login ICP berhasil");
                const identity = authClient.getIdentity();
                console.log("Principal:", identity.getPrincipal().toText());

                const backendActor = await getBackendActor(identity);

                const usernameInput = document.getElementById("username");
                const bioInput = document.getElementById("bio");
                const username = usernameInput ? usernameInput.value : "Anonymous";
                const bio = bioInput ? bioInput.value : "";

                try {
                    await backendActor.login(username, bio);
                    console.log("Data user tersimpan di backend ✅");
                } catch (err) {
                    console.error("Gagal simpan data user di backend:", err);
                }

                loginButton.textContent = "Logout";
                loginButton.onclick = async () => {
                    await authClient.logout();
                    loginButton.textContent = "Login"; // 🔥 tombol balik jadi Login
                    location.reload();
                };
            },
            onError: (err) => {
                console.error("❌ Login gagal:", err);
            }
        });
    });
});
