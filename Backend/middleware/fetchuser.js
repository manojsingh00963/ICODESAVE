import jwt from 'jsonwebtoken';

// eslint-disable-next-line no-undef
const JWT_SECRET = process.env.JWT_SECRET;

const fetchuser = (req, res, next) => {
    // Get the user from the JWT token and add id to req object
    const token = req.header('authToken');
    if (!token) {
        return res.status(401).send({ error: 'Please authenticate using a valid token' });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate using a valid token' });
    }
};

export default fetchuser;
