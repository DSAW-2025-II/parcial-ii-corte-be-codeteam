// --- CONFIGURACIÓN BASE ---
const BASE_URL = "https://parcial-ii-corte-be-codeteam-19.onrender.com"; // 👈 cámbialo por tu backend en producción

// --- ELEMENTOS DEL DOM ---
const loginButton = document.getElementById('loginButton');
const logoutBtn = document.getElementById('logoutBtn');
const authStatus = document.getElementById('authStatus');
const searchButton = document.getElementById('searchButton');
const pokemonInput = document.getElementById("pokeInput");
const result = document.getElementById("pokemonCard");
const message = document.getElementById("message");
const pokemonImage = document.getElementById("pokemonImage");
const pokemonName = document.getElementById("pokemonName");
const pokemonSpecies = document.getElementById("pokemonSpecies");
const pokemonWeight = document.getElementById("pokemonWeight");

// --- FUNCIONES ---
function updateAuthStatus() {
    const token = localStorage.getItem('sessionToken');
    if (token) {
        authStatus.textContent = 'Autenticado';
        authStatus.style.color = 'green';
        searchButton.disabled = false;
    } else {
        authStatus.textContent = 'No autenticado';
        authStatus.style.color = 'red';
        searchButton.disabled = true;
    }
}

// --- LOGIN ---
loginButton.addEventListener('click', async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/auth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "admin@admin.com", password: "admin" })
        });

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.error || "❌ Error en login";
            message.style.color = 'red';
            return;
        }

        localStorage.setItem("sessionToken", data.token);
        message.textContent = "✅ Login exitoso";
        message.style.color = 'green';
        updateAuthStatus();

    } catch (error) {
        message.textContent = error.message || "❌ Error conectando con el backend";
        message.style.color = 'red';
    }
});

// --- LOGOUT ---
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('sessionToken');
    updateAuthStatus();
    message.textContent = 'Logout realizado';
    message.style.color = 'black';
    result.style.display = "none";
    pokemonImage.style.display = "none";
});

// --- BUSCAR POKÉMON ---
searchButton.addEventListener('click', async () => {
    const name = pokemonInput.value.trim();
    if (!name) {
        message.textContent = '⚠️ Escribe el nombre del Pokémon';
        message.style.color = 'red';
        return;
    }

    const token = localStorage.getItem('sessionToken');
    if (!token) {
        message.textContent = '⚠️ No estás autenticado. Haz login primero.';
        message.style.color = 'red';
        return;
    }

    try {
        // Mostrar que está cargando
        message.textContent = "⏳ Buscando...";
        message.style.color = "black";

        const res = await fetch(`${BASE_URL}/api/v1/pokemonDetails`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ pokemonName: name })
        });

        const data = await res.json();

        if (res.status === 200) {
            result.style.display = "block";
            message.textContent = '';
            pokemonImage.src = data.img_url || 'https://via.placeholder.com/120?text=No+image';
            pokemonImage.style.display = "block";
            pokemonName.textContent = `Nombre: ${data.name}`;
            pokemonSpecies.textContent = `Especie: ${data.species}`;
            pokemonWeight.textContent = `Peso: ${data.weight}`;;
        } else {
            result.style.display = "block";
            pokemonImage.style.display = "none";
            pokemonName.textContent = "";
            pokemonSpecies.textContent = "";
            pokemonWeight.textContent = "";
            message.textContent = data.error || "❌ Pokémon no encontrado";
            message.style.color = 'red';
        }

    } catch (error) {
        message.textContent = '❌ Error conectando con el backend';
        message.style.color = 'red';
    }
});

// --- INICIALIZAR ESTADO ---
updateAuthStatus();

