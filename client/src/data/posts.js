import { getUsers } from './users.js';
import * as api from './api.js';


/**
 * This is a mock post collection.
 * It should be removed entirely when the backend is implemented.
 * 
 * You should NOT use any local data structures to cache data
 * from the backend. All requests should go to the backend.
 */


/**
 * NOTE: You do not need to change this function! 
 * If your implementations of getPosts() and getUsers()
 * are working, this function will work just fine.
 * 
 * Get all posts with author names added (as opposed to just author ids)
 * @param {number} author (optional) - The author ID to filter posts by.
 * @returns {Promise<Object[]>} - An array of post objects with author names.
 */
const getPostsWithAuthorNames = async (authorId = null) => {
  let posts = await getPosts(authorId);
  let users = await getUsers();
  return posts.map((post) => {
    const user = users.find((user) => user.id === post.authorId);
    if (!user) {
      throw new Error(`Post ${post.id} found with unknown author ${post.authorId}`);
    }
    return {
      ...post,
      authorName: user?.displayName ?? 'Unknown Author'
    };
  });
};

/**
 * NOTE: You do not need to change this function! 
 * If your implementations of getPost() and getUsers()
 * are working, this function will work just fine.
 * 
 * Get a single post with author name added (as opposed to just author id)
 * @param {String} postId - The post to get.
 * @returns {Promise<Object>} - A post object with author name added.
 */
const getPostWithAuthorName = async (postId) => {
  let users = await getUsers();
  let thePost = await getPost(postId);

  if (!thePost) {
    throw new Error(`Post ${postId} not found.`);
  }
  let theAuthor = users.find(user => user.id === thePost.authorId);
  if (!theAuthor) {
    throw new Error(`Post ${thePost.id} has unknown author ${thePost.authorId}`);
  }

  thePost.authorName = theAuthor?.displayName ?? 'Unknown Author';
  return thePost;
}

/**
 * NOTE: You do not need to change this function! 
 * If your implementations of getPosts() and deletePost()
 * are working, this function will work just fine.
 * 
 * Delete all posts by a user. Needed when a user is deleted.
 * @param {String} postId - The post to get.
 * @returns {Promise<Object>} - A post object with author name added.
 */
const deletePostsByUser = async (userId) => {
  const postsByUser = await getPosts(userId);
  postsByUser.forEach(async post => {
    await deletePost(post.id);
  })
}

/**
 * Get all posts.
 * If an author is provided, it will return only posts by that author.
 * @param {String} author (optional) - The author ID to filter posts by.
 * @returns {Promise<Object[]>} - An array of post objects.
 */
const getPosts = async (authorId = null) => {
  if (authorId) {
    return await api.handleGet(api.ARTICLES_ENDPOINT, {authorId: authorId});
  }
  return await api.handleGet(api.ARTICLES_ENDPOINT);
};

/**
 * Get a post by its ID.
 * @param {String} id - The ID of the post to get.
 * @returns {Promise<Object>} - The post object if found, undefined otherwise
 */
const getPost = async (id) => {
  return await api.handleGet(api.ARTICLES_ENDPOINT, {postId: id});
};

/**
 * Create a new (blog) post.
 * @param {Object} postData - The post data to create.
 * @returns {Promise<Object>} - The created post object.
 */
const createPost = async (postData, user) => {
  const newPost = {
    ...postData,
  };
  const response = await api.handlePost(api.ARTICLES_ENDPOINT, newPost, user.jwt)
  return response;
};

/**
 * Update a post.
 * @param {String} id - The ID of the post to update.
 * @param {Object} updatedFields - The fields to update.
 * @returns {Promise<Object>} - The updated post object.
 *   Fields not included in the object will not be updated.
 * @throws {Error} - if post not found
 */
const updatePost = async (id, updatedFields, user) => {
  const thePost = await api.handleGet(api.ARTICLES_ENDPOINT, {postId: id});

  if (!thePost) {
    throw new Error(`Can't update post. Post with id ${id} not found.`);
  }

  const updatedPost = {
    ...thePost,
    ...updatedFields,
  };
  delete updatedPost.id;
  const response = await api.handlePatch(api.ARTICLES_ENDPOINT, updatedPost, user.jwt, {postId: id})
  return response;
};

/**
 * Delete a post.
 * @param {String} id - The ID of the post to delete.
 * @returns {Promise<void>} - A promise that resolves when the post is deleted.
 */
const deletePost = async (id, user) => {
  await api.handleDelete(api.ARTICLES_ENDPOINT, user.jwt, {postId: id});
};

export {
  getPostsWithAuthorNames,
  getPostWithAuthorName,
  deletePostsByUser,
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};