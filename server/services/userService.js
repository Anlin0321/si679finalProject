import { db } from '../db/db.js';
import { User } from '../models/userModel.js';

const getAll = async () => {
    const userDocs = await db.getAllInCollection(db.USERS);
    return userDocs.map(userDocs => User.fromUserDocument(userDocs));
}

const getById = async (id) => {
    if (!id) throw new Error('Null or undefined ID not allowed.');
    const userDoc = await db.getFromCollectionById(db.USERS, id);
    return User.fromUserDocument(userDoc);
}

const add = async (userInfo) => {
    const { insertedId } = await db.addToCollection(db.USERS, userInfo);
    return {
        id: insertedId.toString(),
        ...userInfo
    }
}

const update = async (id, userInfo) => {
    if (!id) throw new Error('Null or undefined ID not allowed.');
    const { matchedCount, modifiedCount } = await db.updateInCollectionById(
        db.USERS, id, userInfo
    )
    return { matchedCount, modifiedCount };
}

const deleteIt = async (id) => {
    if (!id) throw new Error('Null or undefined ID not allowed.');
    const { deletedCount } = await db.deleteFromCollectionById(db.USERS, id);
    return { deletedCount };
}

export const userService = {
    getAll,
    getById,
    add,
    update,
    deleteIt
}