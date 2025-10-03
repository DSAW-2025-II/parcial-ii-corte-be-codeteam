const express = require('express');
const axios = require('axios');    //Importamos las dos bibliotecas para poder hacer la peticion  HTTP a la pokeapi
const router = express.Router();   // Para agrupar la ruta del pokemon 
const authMiddleware = require('../middlewares/authMiddleware'); //Importa el middleware que valida el  token JWT y permite que continue segura y protegida.

// POST /api/v1/pokemonDetails
router.post('/pokemonDetails', authMiddleware, async (req, res) => {
  const { pokemonName } = req.body || {};     //Extrae pokemonName del cuerpo JSON

  if (!pokemonName || typeof pokemonName !== 'string') {
    return res.status(400).json({ name: "", species: "", weight: "", img_url: "" });   // Creamos el error por si algun dato del pokemon hace falta y poder notificarlo
  }

  try {
    const name = pokemonName.toLowerCase().trim();      //Transforma en minuscula el nombre para  evitar  
    const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`;  //Construye la URL de la pokeapi
    const response = await axios.get(url);    //LLama a la api y espera la respuesta

    const data = response.data;

    const species = (data.species && data.species.name) ? String(data.species.name) : ""; 
    const weight = data.weight !== undefined ? String(data.weight) : "";
    let img_url = "";
                               // Extraemos los datos nesesarios del pokemon

    // Prefer official artwork if available
    if (data.sprites && data.sprites.other && data.sprites.other['official-artwork'] && data.sprites.other['official-artwork'].front_default) {
      img_url = data.sprites.other['official-artwork'].front_default;
    } else if (data.sprites && data.sprites.front_default) {
      img_url = data.sprites.front_default;
    }

    return res.status(200).json({
      name: data.name || "",
      species,
      weight,
      img_url
    });
                      //Devolvemos nuestros datos requeridos para q el usuairo pueda verlos 

  } catch (err) {
    // Si no existe (404) o error, devolvemos campos vacíos y 400
    return res.status(400).json({ name: "", species: "", weight: "", img_url: "" });
  }
});

module.exports = router;
