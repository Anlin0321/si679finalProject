
class User {
    id = '';
    username = '';
    hashedPassword = '';
    displayName = '';

    constructor(userFields) {
        const id = userFields.id ?? String(Date.now());
        this.updateProperties({ id, ...userFields });
    }

    updateProperties = (userFields) => {
        this.id = userFields.id ?? this.id;
        this.username = userFields.username ?? this.username;
        this.hashedPassword = userFields.hashedPassword ?? this.hashedPassword;
        this.displayName = userFields.displayName ?? this.displayName;
    }

    static fromUserDocument = (userDocument) => {
        const id = userDocument._id?.toString();
        if (!id) {
            throw new Error('Could not find _id in User Document');
        }
        delete userDocument._id;
        const user = new User({ id, ...userDocument });
        return user;
    }
}

export { User };