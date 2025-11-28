import { deletePostsByUser } from "./posts.js";
import * as api from './api.js';

/**
 * This is a mock user collection.
 * It should be removed entirely when the backend is implemented.
 * 
 * You should NOT use any local data structures to cache data
 * from the backend. All requests should go to the backend.
 */
let userCollection = [
  {
    id: 'authorId1',
    username: 'j',
    password: '1',
    displayName: 'Jane Doe'
  },
  {
    id: 'authorId2',
    username: 'jindo',
    password: 'password2',
    displayName: 'Jin Do',
  },
];

/**
 * Get a user by their ID.
 * @param {String} id - The ID of the user to get.
 * @returns {Promise<Object>} - The user object or undefined if not found.
 */
const getUserById = async (id) => {
  return await api.handleGet(api.USERS_ENDPOINT, {userId: id});
};

/**
 * Get all users.
 * @returns {Promise<Object[]>} - An array of user objects.
 */
const getUsers = async () => {
  return await api.handleGet(api.USERS_ENDPOINT);
};

/**
 * This function is used to create a new user.
 * @param {String} username - The username of the user to create.
 * @param {String} password - The password of the user to create.
 * @param {String} displayName - The display name of the user to create.
 * @returns {Promise<Object>} - The created user object.
 */
const createUser = async (username, password, displayName) => {
  const id = new Date().getTime().toString();
  const newUser = {
    id,
    username,
    password,
    displayName
  };
  const response = await api.handlePost(api.ADMIN_ENDPOINT, newUser);
  return response;
};

/**
 * This function is used to update a user.
 * @param {String} id - The ID of the user to update.
 * @param {Object} updatedFields - The fields to update. 
 *   Fields not included in the object will not be updated.
 * @returns {Promise<Object>} - The updated user object.
 * @throws {Error} - if user not found

 */
const updateUser = async (id, updatedFields) => {
  const theUser = await api.handleGet(api.USERS_ENDPOINT, {id: id});
  if (!theUser) {
    throw new Error(`Can't update user. User with id ${id}not found`);
  }
  const updatedUser = {
    ...theUser,
    ...updatedFields
  }
  const response = await api.handlePatch(api.USERS_ENDPOINT, updatedUser);
  return response;
};

/**
 * This function is used to delete a user.
 * @param {String} id - The ID of the user to delete.
 * @returns {Promise<void>} - A promise that resolves when the user is deleted.
 */
const deleteUser = async (id) => {
  await api.handleDelete(api.USERS_ENDPOINT, {id: id});
  await deletePostsByUser(id);
};

/**
 * This function is used to validate a login.
 * @param {String} username - The username of the user to validate.
 * @param {String} password - The password of the user to validate.
 * @returns {Promise<Object>} - The user object.
 * @throws {Error} - If the user is not found or the password is incorrect.
 */
const validateLogin = async (username, password) => {
  const user = await api.handlePost(api.AUTH_ENDPOINT, {
    "username": username,
    "password": password
})
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export {
  getUserById,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  validateLogin,
};