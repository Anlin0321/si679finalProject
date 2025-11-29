
import { postService } from '../services/postService.js';

const getPosts = async (req, res) => {
    try {
        const { postId, authorId, availabilityStatus, condition, minPrice, maxPrice, isActive, titleSearch, listingType } = req.query;

        // Define filter parameters
        const filterParams = { availabilityStatus, condition, minPrice, maxPrice, isActive, titleSearch, listingType };
        const hasFilterParams = Object.values(filterParams).some(val => val !== undefined);
        const otherParams = Object.keys(req.query).filter(key => !['postId', 'authorId'].includes(key));

        // Legacy single post lookup
        if (postId) {
            if (otherParams.length > 0) {
                return res.status(400).json({
                    error: 'postId cannot be combined with other query parameters'
                });
            }
            const thePost = await postService.getById(postId);
            if (!thePost) {
                return res.status(404).json({ error: 'Post not found' });
            }
            return res.json(thePost);
        }

        // Legacy author lookup
        if (authorId) {
            if (otherParams.length > 0) {
                return res.status(400).json({
                    error: 'authorId cannot be combined with other query parameters'
                });
            }
            const posts = await postService.getByAuthorId(authorId);
            if (!posts || posts.length === 0) {
                return res.status(404).json({ error: 'No posts found for this author' });
            }
            return res.json(posts);
        }

        // New filtering system
        if (hasFilterParams) {
            const filteredPosts = await postService.getByFilters(filterParams);
            return res.json(filteredPosts);
        }

        // Default: return all posts
        const allPosts = await postService.getAll();
        return res.json(allPosts);

    } catch (error) {
        // Validation errors return 400
        if (error.message.includes('Invalid') ||
            error.message.includes('must be') ||
            error.message.includes('cannot')) {
            return res.status(400).json({ error: error.message });
        }
        // Other errors return 500
        return res.status(500).json({ error: error.message });
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