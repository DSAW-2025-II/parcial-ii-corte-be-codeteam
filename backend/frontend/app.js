const BACKEND_BASE = 'http://localhost:4000';

// --- LOGIN ---
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authStatus = document.getElementById('authStatus');
const searchBtn = document.getElementById('searchBtn');
const pokemonInput = document.getElementById('pokemonInput');
const result = document.getElementById('result');
const message = document.getElementById('message');

function updateAuthStatus() {
  const token = localStorage.getItem('sessionToken');
  if (token) {
    authStatus.textContent = 'Autenticado';
    authStatus.style.color = 'green';
  } else {
    authStatus.textContent = 'No autenticado';
    authStatus.style.color = 'red';
  }
}

loginBtn.addEventListener('click', async () => {
  const body = {
    email: 'admin@admin.com',
    password: 'admin'
  };

  try {
    const res = await fetch(`${BACKEND_BASE}/api/v1/auth`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('sessionToken', data.token);
      message.textContent = 'Login correcto. Token guardado en localStorage.';
      message.style.color = 'green';
      updateAuthStatus();
    } else {
      message.textContent = 'Credenciales inválidas';
      message.style.color = 'red';
    }
  } catch (e) {
    message.textContent = 'Error conectando con el backend';
    message.style.color = 'red';
  }
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('sessionToken');
  updateAuthStatus();
  message.textContent = 'Logout realizado';
  message.style.color = 'black';
});

searchBtn.addEventListener('click', async () => {
  result.innerHTML = '';
  message.textContent = '';
  const name = pokemonInput.value.trim();
  if (!name) {
    message.textContent = 'Escribe el nombre del Pokémon';
    return;
  }

  const token = localStorage.getItem('sessionToken');
  if (!token) {
    message.textContent = 'No estás autenticado. Haz login primero.';
    message.style.color = 'red';
    return;
  }

  try {
    const res = await fetch(`${BACKEND_BASE}/api/v1/pokemonDetails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ pokemonName: name })
    });

    if (res.status === 200) {
      const data = await res.json();
      const html = `
        <div class="card">
          <img src="${data.img_url || 'https://via.placeholder.com/120?text=No+image'}" alt="${data.name}">
          <div>
            <h3>${data.name}</h3>
            <p><strong>Especie:</strong> ${data.species}</p>
            <p><strong>Peso:</strong> ${data.weight}</p>
          </div>
        </div>
      `;
      result.innerHTML = html;
    } else if (res.status === 400) {
      message.textContent = 'Ups! Pokémon no encontrado';
      message.style.color = 'red';
    } else if (res.status === 403) {
      const err = await res.json();
      message.textContent = err.error || 'User not authenticated';
      message.style.color = 'red';
    } else {
      message.textContent = 'Error inesperado';
      message.style.color = 'red';
    }
  } catch (e) {
    message.textContent = 'Error conectando con el backend';
    message.style.color = 'red';
  }
});

// Inicial
updateAuthStatus();

