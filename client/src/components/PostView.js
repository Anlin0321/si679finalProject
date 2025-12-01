import { IMG_BASE_URL } from '../data/api';


function PostView({ post }) {

  return (
    <div className="post-complete">
      <h1>{post.title}</h1>
      <p>{post.message}</p>

      {/* Item Information Section */}
      {post.itemTitle && post.itemTitle !== 'No Item' && (
        <div className="item-details">
          <h2>Item Details</h2>
          <p><strong>Item:</strong> {post.itemName}</p>
          {post.itemDescription && (
            <p><strong>Description:</strong> {post.itemDescription}</p>
          )}
          {post.itemCategory && (
            <p><strong>Category:</strong> {post.itemCategory}</p>
          )}
          <img src={`${IMG_BASE_URL}/${post.itemImage}`} alt={post.itemName} className="product-image" />
        </div>
      )}

      <div className="post-meta">
        <p><strong>Author:</strong> {post.authorName || 'Unknown Author'}</p>
        <p><strong>Price: $</strong> {post.price}</p>
        <p><strong>Shipment: </strong> {post.shipment}</p>
        {post.listingType && (
          <p><strong>Listing Type:</strong> {post.listingType === 'wanted' ? 'Wanted' : 'For Sale'}</p>
        )}
        <p><strong>Status:</strong> {post.availabilityStatus}</p>
      </div>
    </div>
  );
}

export default PostView;