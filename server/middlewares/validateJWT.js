
import jwt from 'jsonwebtoken';

let jwtPrivateKey, jwtPublicKey;

const loadKeys = () => {
    jwtPrivateKey = process.env.JWT_PRIVATE_KEY;
    jwtPublicKey = process.env.JWT_PUBLIC_KEY;
}

const validateJWT = (req, res, next) => {
    loadKeys();
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    const payload = jwt.verify(token, jwtPublicKey, { algorithms: ['RS256'] });
    if (payload?.userId) {
        req.userId = payload.userId;
        next();
    } else {
        res.sendStatus(401);
    }
}

export {
    validateJWT
}