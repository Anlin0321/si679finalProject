import { db } from '../db/db.js';
import { Post } from '../models/postModel.js';
import { itemService } from './itemService.js';

const getAll = async () => {
    const postDocs = await db.getAllInCollection(db.POSTS);
    return postDocs.map(pDoc => Post.fromPostDocument(pDoc));
}

const getById = async (id) => {
    if (!id) throw new Error('Null or undefined ID not allowed.');
    const postDoc = await db.getFromCollectionById(db.POSTS, id);
    return Post.fromPostDocument(postDoc);
}

const getByAuthorId = async (id) => {
    if (!id) throw new Error('Null or undefined ID not allowed.');
    const postDocs = await db.getFromCollectionByFieldValue(db.POSTS, 'authorId', id);
    return postDocs.map(pDoc => Post.fromPostDocument(pDoc));
}

const add = async (postInfo) => {
    // Validate that itemId exists
    if (postInfo.itemId) {
        const item = await itemService.getById(postInfo.itemId);
        if (!item) {
            throw new Error('Invalid itemId: item does not exist');
        }
    }

    const { insertedId } = await db.addToCollection(db.POSTS, postInfo);
    return {
        id: insertedId.toString(),
        ...postInfo
    }
}

const update = async (id, postInfo) => {
    if (!id) throw new Error('Null or undefined ID not allowed.');
    const { matchedCount, modifiedCount } = await db.updateInCollectionById(
        db.POSTS, id, postInfo
    )
    return { matchedCount, modifiedCount };
}

const deleteIt = async (id) => {
    if (!id) throw new Error('Null or undefined ID not allowed.');
    const { deletedCount } = await db.deleteFromCollectionById(db.POSTS, id);
    return { deletedCount };
}

export const postService = {
    getAll,
    getById,
    getByAuthorId,
    add,
    update,
    deleteIt
}