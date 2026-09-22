document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('search-form');
  const emailFilter = document.getElementById('email-filter');
  const userList = document.getElementById('user-list');
  const searchError = document.getElementById('search-error');

  // Load params from URL and trigger initial search if filters exist
  const urlParams = new URLSearchParams(window.location.search);
  const emailParam = urlParams.get('email');

  if (emailParam) {
    emailFilter.value = emailParam;
    fetchUsers(urlParams);
  }

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailFilter.value.trim();

    if (!email) {
      searchError.style.display = 'block';
      return;
    }
    
    searchError.style.display = 'none';
    const params = new URLSearchParams();
    params.set('email', email);

    // Update URL without reloading
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
    fetchUsers(params);
  });

  async function fetchUsers(params) {
    try {
      const response = await fetch(`/api/users?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const users = await response.json();
      
      renderUsers(users);
    } catch (error) {
      console.error(error);
      alert('Error fetching users.');
    }
  }

  function renderUsers(users) {
    userList.innerHTML = '';
    
    if (users.length === 0) {
      userList.innerHTML = '<li>No users found.</li>';
      return;
    }

    users.forEach(user => {
      const li = document.createElement('li');
      li.className = 'user-item';
      li.innerHTML = `
        <div class="user-info">
          <strong>${user.email}</strong>
          <span>ID: ${user.id} | Value: ${user.value} | Created: ${user.created_at}</span>
        </div>
        <div class="user-actions">
          <button class="btn btn-primary" onclick="editUser('${user.id}')">Edit</button>
          <button class="btn btn-danger" onclick="deleteUser('${user.id}')">Delete</button>
        </div>
      `;
      userList.appendChild(li);
    });
  }

  window.editUser = (id) => {
    window.location.href = `/users/edit/${id}`;
  };

  window.deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete user');
      
      // Refresh list using current URL params
      const currentParams = new URLSearchParams(window.location.search);
      fetchUsers(currentParams);
    } catch (error) {
      console.error(error);
      alert('Error deleting user.');
    }
  };
});