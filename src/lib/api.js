const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Add token automatically to every request
async function fetchWithAuth(url, options = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });
}

// ====================== AUTH ===========================

// REGISTER
export async function newUser(data) {
  try {
    const res = await fetchWithAuth(`/users/register`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Signup failed");

    return await res.json();
  } catch (error) {
    console.error("Signup Error:", error);
    throw error;
  }
}

// LOGIN (Different Domain)
export async function loginUser(data) {
  try {
    const res = await fetch(
      `${API_URL}/users/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) throw new Error("Login failed");

    return await res.json();
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
}

// ====================== BLOGS ===========================

// For Static
export async function SingleBlogForStatic(id) {
  try {
    const res = await fetchWithAuth(`/blogs/${id}`);
    const data = await res.json();
    return data?.data;
  } catch (error) {
    console.log("Error fetching single blog:", error);
    throw error;
  }
}

export async function AllBlogsForStatic() {
  try {
    const res = await fetchWithAuth(`/blogs`);
    const data = await res.json();
    return data?.data;
  } catch (error) {
    console.log("Error fetching all blogs:", error);
    return [];
  }
}

// Fetch All Blog
export async function FetchBlog() {
  try {
    const res = await fetchWithAuth(`/blogs`);
    const data = await res.json();
    return data?.data;
  } catch (error) {
    console.log(error);
  }
}

// Single Blog
export async function SingleBlog(id) {
  try {
    const res = await fetchWithAuth(`/blogs/${id}`);
    const data = await res.json();
    return data?.data;
  } catch (error) {
    console.log(error);
  }
}

// Delete Blog
export async function blogDelete(id) {
  try {
    const res = await fetchWithAuth(`/blogs/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete");

    return await res.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Update Blog
export async function blogUpdate(id, data) {
  try {
    const res = await fetchWithAuth(`/blogs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

// ====================== PROFILE ===========================

// Fetch Profile
export async function userProfile() {
  if (typeof window === "undefined") return null;

  const userId = localStorage.getItem("userId");
  if (!userId) return null;

  try {
    const res = await fetchWithAuth(`/users/${userId}/profile`);
    return await res.json();
  } catch (error) {
    console.log("Profile fetch error:", error);
    return null;
  }
}

// ====================== LIKE / COMMENT ===========================

// Like/Unlike
export async function likeUnlike(id) {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    console.log("no user id found");
    return;
  }

  try {
    const res = await fetchWithAuth(`/blogs/${id}/like`, {
      method: "POST",
    });

    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

// lib/api.js


// GET comments
export const getComments = async (blogId) => {
  try {
    const res = await fetch(`${API_URL}/blogs/${blogId}/comments`);
    if (!res.ok) throw new Error("Failed to fetch comments");
    const data = await res.json();
    return data.comments;
  } catch (err) {
    console.error(err);
    return [];
  }
};

// CREATE comment
export const createComment = async (blogId, text) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/blogs/${blogId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error("Failed to create comment");
    return await res.json(); // should return { comment: { ... } }
  } catch (err) {
    console.error(err);
    return null;
  }
};

// UPDATE comment
export const updateComment = async (blogId, commentId, text) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/blogs/${blogId}/comments/${commentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error("Failed to update comment");
    return await res.json(); // should return { comment: { ... } }
  } catch (err) {
    console.error(err);
    return null;
  }
};

// DELETE comment
export const deleteComment = async (blogId, commentId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/blogs/${blogId}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete comment");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};


// ====================== USERS ===========================

// All Users
export async function allUserData() {
  try {
    const res = await fetchWithAuth("/users");
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

// Single User
export async function singleuser(id) {
  try {
    const res = await fetchWithAuth(`/users/${id}`);
    return await res.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Delete User
export async function userDelete(id) {
  try {
    const res = await fetchWithAuth(`/users/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

// Update User
export async function userUpdate(id, data) {
  try {
    const res = await fetchWithAuth(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}
