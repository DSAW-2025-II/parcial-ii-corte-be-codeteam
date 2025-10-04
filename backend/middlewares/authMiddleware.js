const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({ error: 'User not authenticated' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(403).json({ error: 'User not authenticated' });
  }

  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // opcional: puedes usar payload más adelante
    next(); // deja pasar la petición
  } catch (err) {
    return res.status(403).json({ error: 'User not authenticated' });
  }
}

module.exports = authMiddleware;

}

module.exports = authMiddleware; //Exporta los middlewares para q puedan ser usadas en nuestrss rutas protegidas
