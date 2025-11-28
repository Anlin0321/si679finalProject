
import { postService } from '../services/postService.js';

const getPosts = async (req, res) => {
    const { postId, authorId } = req.query;

    try {
        if (postId) {
            const thePost = await postService.getById(postId);
            if (!thePost) {
                return res.status(404).json({ error: 'Post not found' });
            }
            return res.json(thePost);
        }
        if (authorId) {
            const thePost = await postService.getByAuthorId(authorId);
            if (!thePost) {
                return res.status(404).json({ error: 'Post not found' });
            }
            return res.json(thePost);
        }
        // Otherwise, return all posts
        const allPosts = await postService.getAll();
        res.json(allPosts);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const addPost = async (req, res) => {
    const postData = req.body;
    const { id } = await postService.add(postData);
    res.json({ id });
}

const updatePost = async (req, res) => {
    const { postId, userId } = req.query;
    const matchedPost = await postService.getById(postId);
    if (matchedPost.userId != userId) {
        throw new Error("Cannot change others post.")
    }
    const updateInfo = req.body;
    const { matchedCount, modifiedCount } = await postService.update(
        postId, updateInfo
    );
    res.json({ matchedCount, modifiedCount });
}

const deletePost = async (req, res) => {
    const { postId } = req.query;
    const { deletedCount } = await postService.deleteIt(postId);
    res.json({ deletedCount });
}

export const postController = {
    getPosts,
    addPost,
    updatePost,
    deletePost
}