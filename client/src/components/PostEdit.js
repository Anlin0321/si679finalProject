import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { updatePost, createPost } from '../data/posts';
import { getItems, createItem } from '../data/items';

function PostEdit({ post, currentUser }) {

  const navigate = useNavigate();
  if (!currentUser) navigate('/');
  if (!post) {
    post = {
      title: '',
      authorId: currentUser.id,
      authorName: currentUser.displayName
    }
  }
  const [workingPost, setWorkingPost] = useState(post);
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(post.itemId || '');
  const [isCreatingNewItem, setIsCreatingNewItem] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', description: '', category: '' });
  const [itemError, setItemError] = useState('');

  // Load items on component mount
  useEffect(() => {
    const loadItems = async () => {
      const itemsList = (await getItems()) || [];
      setItems(itemsList);
    };
    loadItems();
  }, []);

  // Handle creating a new item
  const handleCreateItem = async () => {
    try {
      setItemError('');
      const createdItem = await createItem(newItem, currentUser);

      // Refresh items list
      const itemsList = (await getItems()) || [];
      setItems(itemsList);

      // Auto-select the new item
      setSelectedItemId(createdItem.id);
      setWorkingPost({ ...workingPost, itemId: createdItem.id });

      // Reset create new mode
      setIsCreatingNewItem(false);
      setNewItem({ title: '', description: '', category: '' });
    } catch (error) {
      setItemError(error.message || 'Failed to create item');
    }
  };

  if (!workingPost) {
    return <div>Loading...</div>;
  }
  return (
    <div className="post-complete">
      <p><strong>Title:</strong></p>
      <p><input type="text" value={workingPost.title} onChange={(e) => {
        setWorkingPost({ ...workingPost, title: e.target.value });
      }} /></p>
      <p><strong>Item:</strong></p>
      <p>
        <select
          value={isCreatingNewItem ? 'CREATE_NEW' : selectedItemId}
          onChange={(e) => {
            if (e.target.value === 'CREATE_NEW') {
              setIsCreatingNewItem(true);
              setSelectedItemId('');
            } else {
              setIsCreatingNewItem(false);
              const parsed = JSON.parse(e.target.value);
              setSelectedItemId(e.target.value);
              setWorkingPost({
                ...workingPost,
                itemId: parsed.id,
                itemName: parsed.name,
              });
            }
          }}
        >
          <option value="" disabled>-- Select Item --</option>
          {items.map((item) => (
            <option key={item.id} value={JSON.stringify({ id: item.id, name: item.title })}>
              {item.title}
            </option>
          ))}
          <option value="CREATE_NEW">+ Create New Item</option>
        </select>
      </p>

      {isCreatingNewItem && (
        <div className="create-item-section">
          <p><strong>New Item Title:</strong></p>
          <p>
            <input
              type="text"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              placeholder="Enter item title"
            />
          </p>

          <p><strong>New Item Description:</strong></p>
          <p>
            <textarea
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              placeholder="Enter item description"
            />
          </p>

          <p><strong>New Item Category:</strong></p>
          <p>
            <input
              type="text"
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              placeholder="Enter category"
            />
          </p>

          {itemError && <p style={{ color: 'red' }}>{itemError}</p>}

          <button
            className="tasty-button small-button"
            onClick={handleCreateItem}
            type="button"
          >
            Submit New Item
          </button>
          <button
            className="tasty-button small-button"
            onClick={() => {
              setIsCreatingNewItem(false);
              setNewItem({ title: '', description: '', category: '' });
              setItemError('');
            }}
            type="button"
          >
            Cancel
          </button>
        </div>
      )}

      <p><strong>Listing Type:</strong></p>
      <p>
        <select
          value={workingPost.listingType || ''}
          onChange={(e) =>
            setWorkingPost({
              ...workingPost,
              listingType: e.target.value,
            })
          }
        >
          <option value="" disabled>-- Select Listing Type --</option>
          <option value="wanted">Wanted</option>
          <option value="for-sale">For Sale</option>
        </select>
      </p>

      <p><strong>Price:</strong></p>
      <p>$<input type="number" value={workingPost.price} onChange={(e) => {
        setWorkingPost({ ...workingPost, price: e.target.value });
      }} /></p>
      <p><strong>Shipment:</strong></p>
      <p><input type="text" value={workingPost.shipment} onChange={(e) => {
        setWorkingPost({ ...workingPost, shipment: e.target.value });
      }} /></p>
      <p><strong>Condition:</strong></p>
      <p>
        <select
          value={workingPost.condition}
          onChange={(e) =>
            setWorkingPost({
              ...workingPost,
              condition: e.target.value,
            })
          }
        >
          <option value="" disabled>-- Select Status --</option>
          <option value="new">DS</option>
          <option value="like_new">Like New</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>

        </select>
      </p>
      <p><strong>Age:</strong></p>
      <p><input type="number" value={workingPost.age} onChange={(e) => {
        setWorkingPost({ ...workingPost, age: e.target.value });
      }} /> Years</p>
      <p><strong>Status:</strong></p>
      <p>
        <select
          value={workingPost.availabilityStatus}
          onChange={(e) =>
            setWorkingPost({
              ...workingPost,
              availabilityStatus: e.target.value,
            })
          }
        >
          <option value="" disabled>-- Select Status --</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="reserved">Reserved</option>
          <option value="removed">Removed</option>
        </select>
      </p>


      <p><strong>Message:</strong></p>
      <p><textarea value={workingPost.message} onChange={(e) => {
        setWorkingPost({ ...workingPost, message: e.target.value });
      }} /></p>
      <div className="post-meta">
        <p><strong>Author:</strong> {currentUser.displayName || 'Unknown Author'}</p>

      </div>
      <button className="tasty-button small-button" onClick={async () => {

        // Ensure itemId is set
        if (!workingPost.itemId && selectedItemId) {
          workingPost.itemId = selectedItemId;
        }

        if (workingPost.id) {
          await updatePost(workingPost.id, workingPost, currentUser);
        } else {
          await createPost(workingPost, currentUser);
        }
        navigate('/managePosts');

      }}>Save</button>
      <button className="tasty-button small-button" onClick={() => {
        navigate('/managePosts');
      }}>Cancel</button>
    </div>
  );
}

export default PostEdit;