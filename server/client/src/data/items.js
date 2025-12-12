import * as api from './api.js';

/**
 * Get all items.
 * @returns {Promise<Object[]>} - An array of item objects.
 */
const getItems = async () => {
  return await api.handleGet(api.ITEMS_ENDPOINT);
};

/**
 * Get an item by its ID.
 * @param {String} id - The ID of the item to get.
 * @returns {Promise<Object>} - The item object if found.
 */
const getItem = async (id) => {
  return await api.handleGet(api.ITEMS_ENDPOINT, {itemId: id});
};

/**
 * Create a new item.
 * @param {Object} itemData - The item data to create (title, description, category).
 * @param {Object} user - The current user with JWT token.
 * @returns {Promise<Object>} - The created item object.
 */
const createItem = async (itemData, user) => {
  const newItem = {
    title: itemData.title,
    description: itemData.description,
    category: itemData.category
  };
  const response = await api.handlePost(api.ITEMS_ENDPOINT, newItem, user.jwt);
  return response;
};

export { getItems, getItem, createItem };
