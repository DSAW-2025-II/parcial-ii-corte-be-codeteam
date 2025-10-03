const BASE_URL = window.location.hostname === "localhost"
  ? "http://localhost:4000"
  : "https://TU_BACKEND_URL.vercel.app"; // 👈 cámbialo por el de Vercel real

// --- LOGIN ---
const loginButton = document.getElementById('loginButton');

loginButton.addEventListener('click', async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/auth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "admin@admin.com", password: "admin" })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Error en login");
            return;
        }

        localStorage.setItem("sessionToken", data.token);
        alert("✅ Login exitoso");

    } catch (error) {
        alert(error.message || "Error en el login");
    }
});

// --- BUSCAR POKÉMON ---
const searchButton = document.getElementById('searchButton');
const pokemonInput = document.getElementById("pokeInput"); // 👈 corregido

searchButton.addEventListener('click', async () => {
    const pokeName = pokemonInput.value.trim().toLowerCase();
    const token = localStorage.getItem("sessionToken");

    if (!token) {
        alert("⚠️ Primero haz login");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/v1/pokemonDetails`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ pokemonName: pokeName })
        });

        const data = await response.json();

        if (response.status === 200) {
            document.getElementById("message").textContent = "";
            document.getElementById("pokemonImage").src = data.img_url;
            document.getElementById("pokemonImage").style.display = "block";
            document.getElementById("pokemonName").textContent = `Nombre: ${data.name}`;
            document.getElementById("pokemonSpecies").textContent = `Especie: ${data.species}`;
            document.getElementById("pokemonWeight").textContent = `Peso: ${data.weight}`;
        } else {
            document.getElementById("message").textContent = "❌ Pokémon no encontrado";
            document.getElementById("pokemonImage").style.display = "none";
            document.getElementById("pokemonName").textContent = "";
            document.getElementById("pokemonSpecies").textContent = "";
            document.getElementById("pokemonWeight").textContent = "";
        }

    } catch (error) {
        console.error("Error en la búsqueda:", error);
    }
});

