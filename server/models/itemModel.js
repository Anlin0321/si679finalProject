
class Item {
    id = '';
    title = '';
    description = '';
    category = '';
    condition = '';
    age = '';
    images = [];
    availabilityStatus = 'available';
    isActive = true;

    constructor(itemFields) {
        const id = itemFields.id ?? String(Date.now());
        this.updateProperties({ id, ...itemFields });
    }

    updateProperties = (itemFields) => {
        this.id = itemFields.id ?? this.id;
        this.title = itemFields.title ?? this.title;
        this.description = itemFields.description ?? this.description;
        this.category = itemFields.category ?? this.category;
        this.condition = itemFields.condition ?? this.condition;
        this.age = itemFields.age ?? this.age;
        this.images = itemFields.images ?? this.images;
        this.availabilityStatus = itemFields.availabilityStatus ?? this.availabilityStatus;
        this.isActive = itemFields.isActive ?? this.isActive;
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

    validateStatus = () => {
        const validStatuses = ['available', 'sold', 'reserved', 'removed'];
        if (!validStatuses.includes(this.availabilityStatus)) {
            throw new Error(`Invalid availability status: ${this.availabilityStatus}. Must be one of: ${validStatuses.join(', ')}`);
        }
        return true;
    }

    validateCondition = () => {
        const validConditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
        if (this.condition && !validConditions.includes(this.condition)) {
            throw new Error(`Invalid condition: ${this.condition}. Must be one of: ${validConditions.join(', ')}`);
        }
        return true;
    }

    validate = () => {
        if (!this.title || this.title.trim() === '') {
            throw new Error('Title is required');
        }
        if (!this.category || this.category.trim() === '') {
            throw new Error('Category is required');
        }
        this.validateStatus();
        this.validateCondition();
        return true;
    }
}

export { Item };
