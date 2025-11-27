
import bcrypt from 'bcrypt';
import { db } from '../db/db.js';
import { User } from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 11;

const registerUser = async (username, password, displayName) => {
    // 1. check if username already exists, error if yes
    const user = await db.getOneFromCollectionByFieldValue(db.USERS, 'username', username);
    if (user) {
        throw new Error('username already exists');
    }

    // 2. hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 3. save user record
    const result = await db.addToCollection(db.USERS, {
        username,
        hashedPassword,
        displayName
    });
    if (!result.acknowledged || !result.insertedId) {
        throw new Error('error adding user to DB');
    }
    return;
}

let jwtPrivateKey, jwtPublicKey

const loadKeys = () => {
    jwtPrivateKey = process.env.JWT_PRIVATE_KEY;
    jwtPublicKey = process.env.JWT_PUBLIC_KEY;
}

const generateToken = (userId) => {
    loadKeys(); // do this lazily to give dotenv a chance to set up
    let data = {
        time: Date(),
        userId
    }
    return jwt.sign(data, jwtPrivateKey, { algorithm: 'RS256', expiresIn: '1h' });
}

const validateLogin = async (username, password) => {
    const userDoc =
        await db.getOneFromCollectionByFieldValue(db.USERS, 'username', username);
    if (!userDoc) {
        throw new Error('username not found.');
    }
    const user = User.fromUserDocument(userDoc);
    const result = await bcrypt.compare(password, user.hashedPassword);
    if (result) {
        delete user.hashedPassword;
        const jwt = generateToken(user.id);
        user.jwt = jwt;
        return user;
    } else {
        throw new Error('invalid password');
    }
}


export const authService = {
    registerUser, validateLogin
}