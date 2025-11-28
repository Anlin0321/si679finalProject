import { itemService } from '../services/itemService.js';

const getItems = async (req, res) => {
    try {
        const itemId = req.query.itemId;

        if (itemId) {
            // Get single item by ID
            const item = await itemService.getById(itemId);
            if (!item) {
                return res.status(404).json({ error: 'Item not found' });
            }
            return res.status(200).json(item);
        } else {
            // Get all items
            const items = await itemService.getAll();
            return res.status(200).json(items);
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const addItem = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const newItem = await itemService.add({ title, description, category });
        return res.status(201).json(newItem);
    } catch (error) {
        if (error.message.includes('required')) {
            return res.status(400).json({ error: error.message });
        }
        if (error.message.includes('Duplicate item')) {
            return res.status(409).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
}

export const itemController = {
    getItems,
    addItem
}
