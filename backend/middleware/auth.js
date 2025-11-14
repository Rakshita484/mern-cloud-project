const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

module.exports = function(req, res, next) {
  const auth = req.headers.authorization;
  // debug log:
  console.log('[AUTH] header:', auth && auth.slice(0,30) + (auth && auth.length>30? '...':'')); // partial log
  if (!auth) return res.status(401).json({ msg: 'No token, authorization denied' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ msg: 'Token error' });
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    console.error('[AUTH] verify error:', err.message);
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};
