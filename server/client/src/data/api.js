const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const ARTICLES_ENDPOINT = `${API_URL}/posts?`;
const AUTH_ENDPOINT = `${API_URL}/login?`;
const ADMIN_ENDPOINT = `${API_URL}/login/register?`;
const USERS_ENDPOINT = `${API_URL}/user?`;
const ITEMS_ENDPOINT = `${API_URL}/items?`;
const IMG_BASE_URL = `${API_URL}/images`


const buildUrlWithQuery = (url, queryParams) => {
  const params = new URLSearchParams(queryParams);
  return `${url}${params.toString()}`;
}

const handleGet = async (url, queryParams = null) => {
  if (queryParams) {
    url = buildUrlWithQuery(url, queryParams);
  }
  const response = await fetch(`${url}`);
  if (response.ok) {
    try {
      return await response.json();
    } catch (error) {
      console.error(`Failed to parse JSON from ${url}:`, error);
      return null;
    }
  } else {
    throw new Error(`GET request to ${url} failed: ${response.statusText}`);
  }
}

const handlePost = async (url, body, jwt, queryParams = null) => {
  if (queryParams) {
    url = buildUrlWithQuery(url, queryParams);
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    },
    body: JSON.stringify(body),
  });
  if (response.ok) {
    try {
      return await response.json();
    } catch (error) {
      console.error(`Failed to parse JSON from ${url}:`, error);
      return { success: true };  // Assume success if response was ok
    }
  } else {
    throw new Error(`POST request to ${url} failed: ${response.statusText}`);
  }
};

const handleDelete = async (url, jwt, queryParams = null) => {
  if (queryParams) {
    url = buildUrlWithQuery(url, queryParams);
  }
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${jwt}`
    }
  });
  if (response.ok) {
    return response.statusText;
  } else {
    throw new Error(`DELETE request to ${url} failed: ${response.statusText}`);
  }
};

const handlePatch = async (url, body, jwt, queryParams = null) => {
  if (queryParams) {
    url = buildUrlWithQuery(url, queryParams);
  }
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    },
    body: JSON.stringify(body),
  });
  if (response.ok) {
    return response.statusText;
  } else {
    throw new Error(`DELETE request to ${url} failed: ${response.statusText}`);
  }
};

export {
  handleGet,
  handlePost,
  handleDelete,
  handlePatch,
  API_URL,
  ARTICLES_ENDPOINT,
  AUTH_ENDPOINT,
  ADMIN_ENDPOINT,
  USERS_ENDPOINT,
  ITEMS_ENDPOINT,
  IMG_BASE_URL
};