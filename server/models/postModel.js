
class Post {
    id = '';
    title = '';
    message = '';
    price = '';
    shipment= '';
    itemId = '';
    userId = ''

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
        this.userId = postFields.userId ?? this.userId;

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
}
export { Post };