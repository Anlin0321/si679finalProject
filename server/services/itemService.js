import { db } from '../db/db.js';
import { Item } from '../models/itemModel.js';

const getAll = async () => {
    const itemDocs = await db.getAllInCollection(db.ITEMS);
    const items = itemDocs.map(doc => Item.fromItemDocument(doc));
    return items;
}

const getById = async (id) => {
    const itemDoc = await db.getFromCollectionById(db.ITEMS, id);
    if (!itemDoc) {
        return null;
    }
    const item = Item.fromItemDocument(itemDoc);
    return item;
}

const checkDuplicate = async (title, category) => {
    const allItems = await db.getAllInCollection(db.ITEMS);
    const duplicate = allItems.find(item =>
        item.title === title && item.category === category
    );
    return duplicate !== undefined;
}

const add = async (itemInfo) => {
    const item = new Item(itemInfo);
    item.validate();

    // Check for duplicate
    const isDuplicate = await checkDuplicate(item.title, item.category);
    if (isDuplicate) {
        throw new Error('Duplicate item: An item with the same title and category already exists');
    }

    const { id, ...itemData } = item;
    const result = await db.addToCollection(db.ITEMS, itemData);
    const addedItem = await getById(result.insertedId);
    return addedItem;
}

export const itemService = {
    getAll,
    getById,
    add,
    checkDuplicate
}
