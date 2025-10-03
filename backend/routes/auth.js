const express = require('express');   //importamos el express y los tokens
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;   // las variables de tipo cont leen los valores desde nuestro archivo .env
const ADMIN_PASS = process.env.ADMIN_PASS;

if (!JWT_SECRET || !ADMIN_EMAIL || !ADMIN_PASS) {   //Verificamos que no haga falta ningun dato y si los ay enviamoes el mensaje para alertar
  console.warn('Warning: set ADMIN_EMAIL, ADMIN_PASS and JWT_SECRET in .env');
}

// POST /api/v1/auth
router.post('/auth', (req, res) => {
  const { email, password } = req.body || {};  //Lee nuestros datos de acceso desde el JSON

  if (!email || !password) {
    return res.status(400).json({ error: 'invalid credentials' });   //Tenemos en cuenta que los datos no pueden ser distintos, si fuera el caso retornamos el error 400
  }

  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {  //comparamos nuestras credenciales y si cumple entra directamente al funcionamiento

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' }); // Si las credenciales son coprrectas se supone que esta funcion deja q el usuario pueda estar como minimo 1h y despues expira
    return res.status(200).json({ token });
  } else {
    return res.status(400).json({ error: 'invalid credentials' });  //asi mismo si no cumple envia el error 400
  }
});

module.exports = router; //Exportamos el router para poder montarlo en nuestro archivo server.js
