const jwt = require('jsonwebtoken');  //Importa,os la libreria para poder verificar los tokens de WJT

const JWT_SECRET = process.env.JWT_SECRET; //Lee nuestra clave desde nueestras variables de entorno, para obtener mayor privacidad


function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({ error: 'User not authenticated' }); //Si no exixte autorisasion envia el error 
  }

  const parts = authHeader.split(' ');                                   // Separa en 2 nuestro token y el Bearer pq nuestro autenticacion nesesita nuestro esquema 
    return res.status(403).json({ error: 'User not authenticated' });    // y credenciales donde el esquema es el Bearer y las credenciales los datos nesesarios para poder autenticar
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
  }

  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();                                            //Llamamos a next() para que la petición del usuario continúe hacia la ruta segura por  nosotros.
  } catch (err) {
    return res.status(403).json({ error: 'User not authenticated' }); //Lanza un error si el token es incorrecto o no coincide 

  }
}

module.exports = authMiddleware; //Exporta los middlewares para q puedan ser usadas en nuestrss rutas protegidas
