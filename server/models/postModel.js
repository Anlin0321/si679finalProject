
class Post {
    id = '';
    title = '';
    message = '';
    price = '';
    shipment= '';
    itemId = '';
    authorId = '';
    condition = '';
    age = '';
    images = [];
    availabilityStatus = 'available';
    isActive = true;

    constructor(postFields) {
        const id = postFields.id ?? String(Date.now());
        this.updateProperties({ id, ...postFields });
    }

    updateProperties = (postFields) => {
        this.id = postFields.id ?? this.id;
        this.title = postFields.title ?? this.title;
        this.message = postFields.message ?? this.message;
        this.price = postFields.price ?? this.price;
        this.shipment = postFields.shipment ?? this.shipment;
        this.itemId = postFields.itemId ?? this.itemId;
        this.authorId = postFields.authorId ?? this.authorId;
        this.condition = postFields.condition ?? this.condition;
        this.age = postFields.age ?? this.age;
        this.images = postFields.images ?? this.images;
        this.availabilityStatus = postFields.availabilityStatus ?? this.availabilityStatus;
        this.isActive = postFields.isActive ?? this.isActive;

    }

    static fromPostDocument = (postDocument) => {
        const id = postDocument._id?.toString();
        if (!id) {
            throw new Error('Could not find _id in Post Document');
        }
        delete postDocument._id;
        const post = new Post({ id, ...postDocument });
        return post;
    }

    validateStatus = () => {
        const validStatuses = ['available', 'sold', 'reserved', 'removed'];
        if (!validStatuses.includes(this.availabilityStatus)) {
            throw new Error(`Invalid availability status: ${this.availabilityStatus}. Must be one of: ${validStatuses.join(', ')}`);
        }
        return true;
    }

    validateCondition = () => {
        const validConditions = ['new', 'like_new', 'good', 'fair', 'poor'];
        if (this.condition && !validConditions.includes(this.condition)) {
            throw new Error(`Invalid condition: ${this.condition}. Must be one of: ${validConditions.join(', ')}`);
        }
        return true;
    }

    validate = () => {
        if (!this.title || this.title.trim() === '') {
            throw new Error('Title is required');
        }
        if (!this.itemId || this.itemId.trim() === '') {
            throw new Error('ItemId is required');
        }
        this.validateStatus();
        this.validateCondition();
        return true;
    }
}
export { Post };