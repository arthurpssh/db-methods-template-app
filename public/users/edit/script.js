document.addEventListener('DOMContentLoaded', async () => {
  const editForm = document.getElementById('edit-form');
  const btnCancel = document.getElementById('btn-cancel');
  
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('id');

  if (!userId) {
    alert('User ID is missing');
    window.location.href = '/users';
    return;
  }

  btnCancel.addEventListener('click', () => {
    window.location.href = '/users';
  });

  // Pre-fill form
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    
    const user = await response.json();
    document.getElementById('id').value = user.id;
    document.getElementById('email').value = user.email;
    document.getElementById('value').value = user.value;
  } catch (error) {
    console.error(error);
    alert('Error loading user data.');
  }

  // Update user
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
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

      if (!response.ok) throw new Error('Failed to update user');
      
      alert('User updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Error updating user.');
    }
  });
});