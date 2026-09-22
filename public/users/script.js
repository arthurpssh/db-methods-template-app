document.addEventListener('DOMContentLoaded', fetchAndPopulateList);

async function fetchAndPopulateList() {
  const userListElement = document.getElementById('user-list');

  try {
    const response = await fetch('/api/users');
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const users = await response.json();

    // Clear the loading message
    userListElement.innerHTML = '';

    // Handle empty state
    if (users.length === 0) {
      userListElement.innerHTML = '<li>No users found.</li>';
      return;
    }

    // Populate the list
    users.result.forEach(user => {
      const li = document.createElement('li');
      
      // Adapt the properties (user.name, user.email) to match your API response
      li.textContent = `${user.id} - ${user.email}`;
      li.classList.add('user-item'); 

      userListElement.appendChild(li);
    });

  } catch (error) {
    console.error('Failed to fetch users:', error);
    userListElement.innerHTML = '<li>Error loading users. Please try again later.</li>';
  }
}