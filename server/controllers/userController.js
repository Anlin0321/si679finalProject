
import { userService } from '../services/userService.js';

const getUsers = async (req, res) => {
    const { userId } = req.query;

    try {
        if (userId) {
            const theUser = await userService.getById(userId);
            if (!theUser) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.json(theUser); // single object
        }

        // Otherwise, return all posts
        const allUsers = await userService.getAll();
        res.json(allUsers);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addUser = async (req, res) => {
    const userData = req.body;
    const { id } = await userService.add(userData);
    res.json({ id });
}

const updateUser = async (req, res) => {
    const { userId } = req.query;
    const updateInfo = req.body;
    const { matchedCount, modifiedCount } = await userService.update(
        userId, updateInfo
    );
    res.json({ matchedCount, modifiedCount });
}

const deleteUser = async (req, res) => {
    const { userId } = req.query;
    const { deletedCount } = await userService.deleteIt(userId);
    res.json({ deletedCount });
}

export const userController = {
    getUsers,
    addUser,
    updateUser,
    deleteUser
}