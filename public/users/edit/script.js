document.addEventListener('DOMContentLoaded', async () => {
  const editForm = document.getElementById('edit-form');
  const btnCancel = document.getElementById('btn-cancel');
  const btnSubmit = editForm.querySelector('button[type="submit"]'); // Reference to the submit button
  
  // 1. Extract ID from Path Parameter (e.g., /users/edit/123)
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  const userId = pathSegments[pathSegments.length - 1];

  // Validate if we actually got an ID and not the "edit" path segment itself
  if (!userId || userId === 'edit') {
    alert('User ID is missing from the URL.');
    window.location.href = '/users/search'; // Redirects to a safe page
    return;
  }

  btnCancel.addEventListener('click', () => {
    window.location.href = '/users/search';
  });

  // 2. Pre-fill form
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      if (response.status === 429) throw new Error('Rate limit exceeded. Try again later.');
      throw new Error('Failed to fetch user');
    }
    
    const user = await response.json();
    
    // Check if element exists before assigning to avoid runtime errors
    if (document.getElementById('id')) document.getElementById('id').value = user.id;
    document.getElementById('email').value = user.email;
    document.getElementById('value').value = user.value;
  } catch (error) {
    console.error('[Edit User - Load]:', error);
    alert(error.message || 'Error loading user data.');
  }

  // 3. Update user
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Prevent double-submit to protect Google Sheets quota
    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.textContent = 'Updating...'; 
    }
    
    const payload = {
      email: document.getElementById('email').value,
      value: document.getElementById('value').value
    };

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status === 429) throw new Error('Rate limit exceeded. Please wait a moment.');
        throw new Error('Failed to update user');
      }
      
      alert('User updated successfully!');
      window.location.href = '/users/search'; // Optional: redirect after success
    } catch (error) {
      console.error('[Edit User - Update]:', error);
      alert(error.message || 'Error updating user.');
    } finally {
      // Re-enable the button regardless of success or failure
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Update User';
      }
    }
  });
});