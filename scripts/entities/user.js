import {api, API_BASE_URL} from '/scripts/common/api.js';

export function editUser(id) {
    api.get(`/users/${id}`)
        .then(user => {
           document.getElementById("username").value = user.username;
            document.getElementById("nom").value = user.nom;
            document.getElementById("prenom").value = user.prenom;
           document.getElementById("roles").value = user.role.roleId;
           document.getElementById('id').value = user.userId;
            document.getElementById('passwd').style.display= "none";
            document.getElementById('confirm').style.display= "none";
            document.querySelector('[for="passwd"]').style.display= "none";
            document.querySelector('[for="confirm"]').style.display= "none";

            const userModal = new bootstrap.Modal(document.getElementById('userModal'), {
                keyboard: false
            });
            userModal.show();
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}


export function fetchUsers() {
    api.get('/users')
        .then(users => {
            let rows = '';
            users.forEach(user => {
                rows += `
                    <tr>
                        <td>${user.username}</td>
                        <td>${user.prenom } ${user.nom}</td>
                        <td>${user.role.label}</td>
                        <td>
                        <div class="btn-group" role="group" aria-label="Actions">
                            <button class="btn btn-primary btn-floating  me-2" aria-label="Modifier" onclick="editUser(${user.userId})" data-mdb-ripple-init>
                                  <i class="fa-solid fa-pencil"></i>
                            </button>
                            <button class="btn btn-danger btn-floating" aria-label="Supprimer" onclick="deleteUser(${user.userId})" data-mdb-ripple-init>
                                  <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                        </td>
                    </tr>
                `;
            });
            document.getElementById('userRows').innerHTML = rows;
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}

export function deleteUser(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce user ?')) {
        api.delete(`/users/${id}`)
            .then(() => {
                fetchUsers();
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
}

export function addUser() {
    console;
    console.log("dans add user");
    event.preventDefault(); // Empêche la soumission par défaut
    const form = document.getElementById('userForm');
    const passwdInputText = document.getElementById("passwd");
    const confirmInputText = document.getElementById("confirm");
    const passwdError = document.getElementById('passwdError');
    const confirmError = document.getElementById('confirmError');
    const mailError = document.getElementById('mailError');
    confirmInputText.setCustomValidity('');
    confirmInputText.classList.remove('is-invalid');
    confirmError.style.display = 'none';
    if (form.checkValidity() === false) {
        event.stopPropagation();
    }
        else if (passwdInputText.value !== confirmInputText.value) {
        confirmInputText.setCustomValidity('Les mots de passe ne correspondent pas');
        confirmInputText.classList.add('is-invalid');
        confirmError.style.display = 'block';
        event.preventDefault();
        event.stopPropagation();
    } else {
        confirmInputText.setCustomValidity('');
        confirmInputText.classList.remove('is-invalid');
        confirmError.style.display = 'none';
        const usernameInputText = document.getElementById("username");
        const nomInputText = document.getElementById("nom");
        const prenomInputText = document.getElementById("prenom");
        const roleSelect = document.getElementById("roles");

        const item = {
            username :usernameInputText.value.trim(),
            nom: nomInputText.value.trim(),
            prenom :prenomInputText.value.trim(),
            role: roleSelect.value,
            password: passwdInputText.value.trim(),
        }
                api.post(`/users/`, item)
                    .then((response) => {
                        if (response.ok) {
                            form.reset();
                            form.classList.remove('was-validated')
                            fetchUsers();
                            document.getElementById("btn-close").click();
                        }else  {
                            //usernameInputText.setCustomValidity(response.message);
                            usernameInputText.classList.add('is-invalid');
                            mailError.style.display = 'block';
                            mailError.innerText = response.message;
                        }
                    })
                    .catch(error => {
                        console.error('There was an error!', error);
                    });
    }
    form.classList.add('was-validated');
}

export function showInputsPasswd() {
    document.getElementById('passwd').style.display= "block";
    document.getElementById('confirm').style.display= "block";
    document.querySelector('[for="passwd"]').style.display= "block";
    document.querySelector('[for="confirm"]').style.display= "block";
}