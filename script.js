const form = document.getElementById('form');
const ul = document.getElementById('ul');

document.addEventListener('DOMContentLoaded', function () {
  // Fetch existing passwords on page load
  axios.get('https://crudcrud.com/api/0dde6864c03e4d9a9049d1049ef4d731/PasswordTracker')
    .then((response) => {
      const passwordData = response.data;
      ul.innerHTML = ''; // Ensures a clean slate for new data
      passwordData.forEach((passwordObject) => {
        showPasswordOfTitle(passwordObject);
      });
    })
    .catch((error) => {
      console.error('Error fetching password data:', error);
    });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const password = document.getElementById('password').value;

    // Basic validation (consider more robust validation)
    if (!title.trim() || !password.trim()) {
      alert('Please enter a title and password.');
      return;
    }

    const newPasswordObject = { title, password };

    axios.post('https://crudcrud.com/api/0dde6864c03e4d9a9049d1049ef4d731/PasswordTracker', newPasswordObject)
      .then((result) => {
        showPasswordOfTitle(result.data); // Display newly added password
      })
      .catch((error) => {
        console.error('Error adding password:', error);
      });

    // Reset the form after successful submission
    form.reset();
    showPasswordOfTitle(newPasswordObject);
    updateTotalDisplay();
    addPassword(title, password);
  });
});

function showPasswordOfTitle(newPasswordObject) {
  const li = document.createElement('li');
  const ul=document.getElementById('ul')
  const liText = document.createTextNode(`The password of ${newPasswordObject.title} is ${newPasswordObject.password}`);
  li.appendChild(liText);
  li.style.margin = '10px';
  li.className='list';
  li.style.backgroundColor = 'lightyellow';
  ul.appendChild(li);

  const deleteBtn = document.createElement('button');
  const deleteBtnText = document.createTextNode('Delete Details');
  deleteBtn.appendChild(deleteBtnText);
  li.appendChild(deleteBtn);

  deleteBtn.addEventListener('click', function () {
    const userList = event.target.parentElement;
    userList.remove();
     axios.delete(`https://crudcrud.com/api/0dde6864c03e4d9a9049d1049ef4d731/PasswordTracker/${newPasswordObject._id}`)
    .then((result)=>{console.log(result.data)})
    .catch((error)=>{console.log(error)})
  });

  const editBtn = document.createElement('button');
  const editBtnText = document.createTextNode('Edit Details');
  editBtn.appendChild(editBtnText);
  li.appendChild(editBtn);

  const editForm = document.createElement('form');
  editForm.style.display = 'none';

  const editTitle = document.createElement('input');
  editTitle.type = 'text';
  editTitle.id = 'title';
  editTitle.value = newPasswordObject.title; // Pre-fill with existing title because title will never change only password will change
  editForm.appendChild(editTitle);

  const editPassword = document.createElement('input');
  editPassword.type = 'password';
  editPassword.id = 'password';
  editForm.appendChild(editPassword);

  const editSubmitButton = document.createElement('button');
  const editSubmitText = document.createTextNode('Save');
  editSubmitButton.appendChild(editSubmitText);
  editForm.appendChild(editSubmitButton);

  const editCancelButton = document.createElement('button');
  const editCancelText = document.createTextNode('Cancel');
  editCancelButton.appendChild(editCancelText);
  editForm.appendChild(editCancelButton);

  li.appendChild(editForm);

  editBtn.addEventListener('click', function (event) {
    editForm.style.display = editForm.style.display === 'none' ? 'block' : 'none';
  });

  editSubmitButton.addEventListener('click', function (event) {
    event.preventDefault();
    liText.textContent=`The password of ${editTitle.value} is ${editPassword.value}`
     const editedData = {
    title: editTitle.value, // Assuming editTitle is an input element
    password: editPassword.value, // Assuming editPassword is an input element
  };
    axios.put(`https://crudcrud.com/api/0dde6864c03e4d9a9049d1049ef4d731/${editedData._id}`,editedData)
    .then((result)=>{console.log(result.data)})
    .catch((error)=>{console.log(error)})
  })
   editCancelButton.addEventListener('click',function(event){
     event.preventDefault();
     editForm.style.display='none';
   })
}
 

const filter = document.getElementById('search'); // Corrected typo: 'search' instead of 'serach'
filter.addEventListener('keyup', function () {
  const textEntered = event.target.value.toLowerCase();
  const listItems = document.getElementsByClassName('list');

  for (let i = 0; i < listItems.length; i++) {
    const listContent = listItems[i].firstChild.textContent.toLowerCase();
    const shouldDisplay = listContent.indexOf(textEntered) !== -1; // Check if content matches filter

    listItems[i].style.display = shouldDisplay ? 'flex' : 'none'; // Set display based on match
  }
});

 let totalPasswords = 0;

    function addPassword(title, password) {
      // Secure password storage logic (not shown)
      totalPasswords++;
      updateTotalDisplay();
      return false; // Prevent form submission (optional)
    }

    function updateTotalDisplay() {
      document.getElementById("total-password-count").textContent = totalPasswords;
    }