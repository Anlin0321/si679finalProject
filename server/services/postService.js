import { db } from '../db/db.js';
import { Post } from '../models/postModel.js';
import { itemService } from './itemService.js';
import { socket } from '../socket/clientUpdate.js';


// Validation constants
const VALID_AVAILABILITY_STATUSES = ['available', 'sold', 'reserved', 'removed'];
const VALID_CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
const VALID_LISTING_TYPES = ['wanted', 'for-sale'];

// Validation helper
const validateFilterParams = (filters) => {
    const { availabilityStatus, condition, minPrice, maxPrice, isActive, titleSearch, listingType } = filters;

    if (availabilityStatus && !VALID_AVAILABILITY_STATUSES.includes(availabilityStatus)) {
        throw new Error(`Invalid availabilityStatus. Must be one of: ${VALID_AVAILABILITY_STATUSES.join(', ')}`);
    }

    if (condition && !VALID_CONDITIONS.includes(condition)) {
        throw new Error(`Invalid condition. Must be one of: ${VALID_CONDITIONS.join(', ')}`);
    }

    if (listingType && !VALID_LISTING_TYPES.includes(listingType)) {
        throw new Error(`Invalid listingType. Must be one of: ${VALID_LISTING_TYPES.join(', ')}`);
    }

    if (minPrice !== undefined) {
        const min = parseFloat(minPrice);
        if (isNaN(min) || min < 0) {
            throw new Error('minPrice must be a non-negative number');
        }
    }

    if (maxPrice !== undefined) {
        const max = parseFloat(maxPrice);
        if (isNaN(max) || max < 0) {
            throw new Error('maxPrice must be a non-negative number');
        }
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
        const min = parseFloat(minPrice);
        const max = parseFloat(maxPrice);
        if (min > max) {
            throw new Error('minPrice cannot be greater than maxPrice');
        }
    }

    if (isActive !== undefined && !['true', 'false'].includes(String(isActive).toLowerCase())) {
        throw new Error('isActive must be true or false');
    }

    if (titleSearch !== undefined && String(titleSearch).trim() === '') {
        throw new Error('titleSearch cannot be empty');
    }

    return true;
}

// Query builder
const buildFilterQuery = (filters) => {
    const query = {};
    const { availabilityStatus, condition, minPrice, maxPrice, isActive, titleSearch, listingType } = filters;

    // Exact match filters
    if (availabilityStatus) {
        query.availabilityStatus = availabilityStatus;
    }

    if (condition) {
        query.condition = condition;
    }

    if (listingType) {
        query.listingType = listingType;
    }

    if (isActive !== undefined) {
        query.isActive = String(isActive).toLowerCase() === 'true';
    }

    // Title search - case-insensitive partial match
    if (titleSearch) {
        query.title = { $regex: titleSearch, $options: 'i' };
    }

    // Price range - using $expr for string-to-number conversion
    const priceConditions = [];
    if (minPrice !== undefined) {
        const minPriceNum = parseFloat(minPrice);
        priceConditions.push({ $gte: [{ $toDouble: "$price" }, minPriceNum] });
    }
    if (maxPrice !== undefined) {
        const maxPriceNum = parseFloat(maxPrice);
        priceConditions.push({ $lte: [{ $toDouble: "$price" }, maxPriceNum] });
    }

    if (priceConditions.length > 0) {
        query.$expr = priceConditions.length === 1
            ? priceConditions[0]
            : { $and: priceConditions };
    }

    return query;
}

let changeStream = null;
const watchPosts = async () => {
    const callback = (change) => {
        if (change.operationType === 'update') {
            console.log('change', change.updateDescription.updatedFields);
            socket.updatePost(
                change.documentKey._id.toString(),
                change.updateDescription.updatedFields
            );
        }
        else if (change.operationType === 'insert') {
            console.log('add', change.fullDocument);
            socket.addPost(
                change.fullDocument
            );
        }
        else if (change.operationType === 'delete') {
            console.log('delete', change.documentKey._id.toString());
            socket.deletePost(
                change.documentKey._id.toString()
            );
        }
    };
    changeStream = await db.watchCollection(db.PRODUCTS, callback);
    console.log('watching products');
}

const stopWatchingPosts = async () => {
    await db.closeChangeStream(changeStream);
    changeStream = null;
}

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

const getByFilters = async (filters) => {
    validateFilterParams(filters);
    const query = buildFilterQuery(filters);
    const postDocs = await db.queryCollection(db.POSTS, query);
    return postDocs.map(pDoc => Post.fromPostDocument(pDoc));
}

export const postService = {
    watchPosts,
    stopWatchingPosts,
    getAll,
    getById,
    getByAuthorId,
    getByFilters,
    add,
    update,
    deleteIt
}