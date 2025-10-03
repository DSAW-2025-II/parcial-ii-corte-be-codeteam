require('dotenv').config();          // Cargamos nuestras variables de entorno desde nuestro archivo .env y permite q process.env.var funcione correcta,mente 
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const pokemonRoutes = require('./routes/pokemon');

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || '*';

app.use(express.json());

app.use(cors({
  origin: FRONTEND_URL      //Peritimos que el fronted pueda llamar al bacjkend desde el navegador
}));

app.use('/api/v1', authRoutes);
app.use('/api/v1', pokemonRoutes);

const PORT = process.env.PORT || 4000;    //Puerto donde escuchará el servido o tamnbien se puede por medio de 4000 
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`)); //Inicia y muestra el mensaje en nuestra consola

