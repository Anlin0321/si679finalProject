import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { getPostsWithAuthorNamesAndItems } from "../data/posts";
import { getItems } from "../data/items";


function Home() {
  const [posts, setPosts] = useState([]);
  const [allItems, setAllItems] = useState([]);

  // Form state (staging area for user input)
  const [filterForm, setFilterForm] = useState({
    availabilityStatus: '',
    condition: '',
    listingType: '',
    minPrice: '',
    maxPrice: '',
    titleSearch: '',
    itemCategory: ''
  });

  // Applied filters (what's actually sent to API)
  const [appliedFilters, setAppliedFilters] = useState({
    availabilityStatus: '',
    condition: '',
    listingType: '',
    minPrice: '',
    maxPrice: '',
    titleSearch: '',
    itemCategory: ''
  });

  // Load items for category dropdown
  useEffect(() => {
    const loadItems = async () => {
      const items = await getItems() || [];
      setAllItems(items);
    };
    loadItems();
  }, []);

  // Fetch posts with filters (only when appliedFilters changes)
  useEffect(() => {
    const fetchPosts = async () => {
      // Build filter object (exclude empty values)
      const activeFilters = {};
      Object.keys(appliedFilters).forEach(key => {
        if (appliedFilters[key] !== '') {
          activeFilters[key] = appliedFilters[key];
        }
      });

      const posts = await getPostsWithAuthorNamesAndItems(null, activeFilters);
      console.log('in Home useEffect, posts were fetched:', posts);
      setPosts(posts);
    };
    fetchPosts();
  }, [appliedFilters]);

  // Get unique categories from all items
  const uniqueCategories = [...new Set(allItems.map(item => item.category).filter(Boolean))];

  const handleFilterChange = (filterName, value) => {
    setFilterForm(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filterForm });
  };

  const clearFilters = () => {
    const emptyFilters = {
      availabilityStatus: '',
      condition: '',
      listingType: '',
      minPrice: '',
      maxPrice: '',
      titleSearch: '',
      itemCategory: ''
    };
    setFilterForm(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  return (
    <div>
      <h1>All Posts</h1>

      {/* Filter Section */}
      <div className="filters-container">
        <h3>Filters</h3>
        <div className="filters-grid">

          {/* Title Search */}
          <div className="filter-item">
            <label>Search Title:</label>
            <input
              type="text"
              value={filterForm.titleSearch}
              onChange={(e) => handleFilterChange('titleSearch', e.target.value)}
              placeholder="Search..."
            />
          </div>

          {/* Listing Type */}
          <div className="filter-item">
            <label>Listing Type:</label>
            <select
              value={filterForm.listingType}
              onChange={(e) => handleFilterChange('listingType', e.target.value)}
            >
              <option value="">All</option>
              <option value="wanted">Wanted</option>
              <option value="for-sale">For Sale</option>
            </select>
          </div>

          {/* Availability Status */}
          <div className="filter-item">
            <label>Status:</label>
            <select
              value={filterForm.availabilityStatus}
              onChange={(e) => handleFilterChange('availabilityStatus', e.target.value)}
            >
              <option value="">All</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="reserved">Reserved</option>
              <option value="removed">Removed</option>
            </select>
          </div>

          {/* Condition */}
          <div className="filter-item">
            <label>Condition:</label>
            <select
              value={filterForm.condition}
              onChange={(e) => handleFilterChange('condition', e.target.value)}
            >
              <option value="">All</option>
              <option value="New">DS/New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          {/* Item Category */}
          <div className="filter-item">
            <label>Item Category:</label>
            <select
              value={filterForm.itemCategory}
              onChange={(e) => handleFilterChange('itemCategory', e.target.value)}
            >
              <option value="">All</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="filter-item">
            <label>Min Price:</label>
            <input
              type="number"
              min="0"
              value={filterForm.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              placeholder="$0"
            />
          </div>

          <div className="filter-item">
            <label>Max Price:</label>
            <input
              type="number"
              min="0"
              value={filterForm.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              placeholder="No limit"
            />
          </div>

          {/* Filter Action Buttons */}
          <div className="filter-item">
            <button
              className="tasty-button small-button"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
          </div>

          <div className="filter-item">
            <button
              className="tasty-button small-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>

        </div>
      </div>

      {/* Posts Table */}
      <div className="content-container">
        <div className="table-wrapper">
          <table className="blog-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Item</th>
                <th>Author</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>
                    No posts found matching filters
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id}>
                    <td><Link to={`/viewPost/${post.id}`}>{post.title}</Link></td>
                    <td>{post.itemTitle || 'No Item'}</td>
                    <td>{post.authorName}</td>
                    <td>${post.price}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Home;
