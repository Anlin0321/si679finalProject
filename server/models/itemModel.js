
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
}

export { Item };
