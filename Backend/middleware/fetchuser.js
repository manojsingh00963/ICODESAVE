import jwt from 'jsonwebtoken';

const fetchuser = (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_icodesave_jwt_token_2026';

  // Support authToken, auth-token, or Authorization: Bearer <token>
  let token = req.header('authToken') || req.header('auth-token');
  if (!token && req.header('authorization')) {
    const authHeader = req.header('authorization');
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    }
  }

  if (!token || token === 'undefined' || token === 'null') {
    return res.status(401).json({ success: false, error: 'Please authenticate using a valid token' });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Token expired or invalid. Please login again.' });
  }
};

export default fetchuser;
