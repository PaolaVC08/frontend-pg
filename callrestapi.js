var url = "https://pg-restapi-pvxk.onrender.com/api/users";
function postUser() {
  console.log(url);

	var myName = $('#name').val();
	var myEmail = $('#email').val();
	var myAge = $('#age').val();
	var myComments = $('#comments').val();

	var myuser = {
	  name: myName, 
	  email: myEmail, 
	  age: myAge, 
	  comments: myComments
	};
	console.log(myuser)

	$.ajax({
          url:url, 
	  type: 'post', 
	  dataType: 'json',
	  contentType: 'application/json',
    	  success: function (data){
        	console.log(data);
	    getUsers(); 
          //$('#resultado').html(JSON.stringify(data.user));
          resetForm(); 
	  },
          data: JSON.stringify(myuser)
	});
}

function getUsers() {
    console.log(url);

    $.getJSON(url, function(json) {
        console.log(json);

        var arrUsers = json.users;

	    var rows = '';

    arrUsers.forEach(function(item) {
      console.log(item);

      rows += `
        <tr>
          <td>${item.name}</td>
          <td>${item.email}</td>
          <td>${item.age}</td>
          <td>${item.comments}</td>
          <td>
            <button onclick='startEditUser(${JSON.stringify(item)})'><i class="fas fa-edit" style="color:#6a1b9a;"></i></button>
            <button onclick='deleteUser(${item.id})'><i class="fas fa-trash-alt" style="color:#d32f2f;"></i></button>
          </td>
        </tr>
      `;
    });

    $('#userTableBody').html(rows);
    });
}

function deleteUser(id) {
const confirmDelete = confirm("Are you sure you want to delete this user?");
  if (!confirmDelete) return;
	$.ajax({
    url: url + '/' + id,
    type: 'DELETE',
    success: function(data) {
      alert('User deleted');
      getUsers(); // refrescar lista
    },
    error: function(err) {
      alert('Error deleting user');
    }
  });
}

let editingId = null;

function startEditUser(user) {
  $('#name').val(user.name);
  $('#email').val(user.email);
  $('#age').val(user.age);
  $('#comments').val(user.comments);
  editingId = user.id;
$('#submitBtn').text('Save');
}
function handleSubmit() {
  if (editingId) {
    updateUser();
  } else {
    postUser();
  }
}

function updateUser() {
  if (!editingId) return;
const confirmUpdate = confirm("Do you want to save these changes?");
  if (!confirmUpdate) return;
  const updatedUser = {
    name: $('#name').val(),
    email: $('#email').val(),
    age: $('#age').val(),
    comments: $('#comments').val()
  };

  $.ajax({
    url: url + '/' + editingId,
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify(updatedUser),
    success: function(data) {
      alert('User updated');
      editingId = null;
      getUsers(); // refrescar
      resetForm();
    },
    error: function(err) {
      alert('Error updating user');
    }
  });
}
function getUserById() {
  const id = $('#searchId').val(); 

  $.ajax({
    url: url + '/' + id,
    type: 'GET',
    success: function(data) {
      const user = data.user;

      const html = `
        <p><strong>ID:</strong> ${user.id}</p>
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Age:</strong> ${user.age}</p>
        <p><strong>Comments:</strong> ${user.comments}</p>
      `;

      $('#resultado').html(html);
    },
    error: function(err) {
      alert('User not found or error');
      console.error(err);
    }
  });
}
window.onload = function() {
  getUsers();
};
function resetForm() {
  $('#name').val('');
  $('#email').val('');
  $('#age').val('');
  $('#comments').val('');
  editingId = null;
  $('#submitBtn').text('Add');
}

