document.addEventListener('DOMContentLoaded', () => {
  const createForm = document.getElementById('create-form');
  const btnCancel = document.getElementById('btn-cancel');

  btnCancel.addEventListener('click', () => {
    window.location.href = '/users';
  });

  createForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const payload = {
      email: document.getElementById('email').value,
      value: document.getElementById('value').value,
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to create user');
      
      const result = await response.json();
      window.location.href = `/users/edit/${result.id}`;
    } catch (error) {
      console.error(error);
      alert('Error creating user.');
    }
  });
});