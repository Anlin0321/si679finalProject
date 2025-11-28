
class Item {
    id = '';
    title = '';
    description = '';
    category = '';

    constructor(itemFields) {
        const id = itemFields.id ?? String(Date.now());
        this.updateProperties({ id, ...itemFields });
    }

    updateProperties = (itemFields) => {
        this.id = itemFields.id ?? this.id;
        this.title = itemFields.title ?? this.title;
        this.description = itemFields.description ?? this.description;
        this.category = itemFields.category ?? this.category;
    }

    static fromItemDocument = (itemDocument) => {
        const id = itemDocument._id?.toString();
        if (!id) {
            throw new Error('Could not find _id in Item Document');
        }
        delete itemDocument._id;
        const item = new Item({ id, ...itemDocument });
        return item;
    }

    validate = () => {
        if (!this.title || this.title.trim() === '') {
            throw new Error('Title is required');
        }
        if (!this.category || this.category.trim() === '') {
            throw new Error('Category is required');
        }
        if (!this.description || this.description.trim() === '') {
            throw new Error('Description is required');
        }
        return true;
    }
}

export { Item };
