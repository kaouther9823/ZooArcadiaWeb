import {api} from '/scripts/common/api.js';
import {INIT_PAGE, ITEM_PER_PAGE} from "/scripts/common/commun.js";

export function editUser(id) {
    api.get(`/users/${id}`)
        .then(user => {
            document.getElementById('addModalLabel').innerText = "Editer un utilisateur";
            document.getElementById("username").value = user.username;
            document.getElementById("nom").value = user.nom;
            document.getElementById("prenom").value = user.prenom;
            document.getElementById("roles").value = user.roles;
            document.getElementById('id').value = user.userId;
            document.getElementById('passwd').style.display = "none";
            document.getElementById('confirm').style.display = "none";
            document.querySelector('[for="passwd"]').style.display = "none";
            document.querySelector('[for="confirm"]').style.display = "none";

            const userModal = new bootstrap.Modal(document.getElementById('userModal'), {
                keyboard: false
            });
            userModal.show();
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}


export function fetchUsers(page = INIT_PAGE, usersPerPage = ITEM_PER_PAGE) {
    api.get('/users')
        .then(users => {
            const totalUsers = users.length;
            const totalPages = Math.ceil(totalUsers / usersPerPage);
            const offset = (page - 1) * usersPerPage;
            const paginatedUsers = users.slice(offset, offset + usersPerPage);
            let rows = '';
            paginatedUsers.forEach(user => {
                rows += `
                    <tr>
                        <td>${user.username}</td>
                        <td>${user.prenom} ${user.nom}</td>
                        <td>${user.roles}</td>
                        <td>
                        <div class="btn-group" role="group" aria-label="Actions">
                            <button class="btn btn-primary btn-floating  me-2" aria-label="Modifier" title="Modifier" onclick="editUser(${user.userId})" data-mdb-ripple-init>
                                  <i class="fa-solid fa-pencil"></i>
                            </button>
                            <button class="btn btn-danger btn-floating" aria-label="Supprimer" title="Supprimer" onclick="deleteUser(${user.userId})" data-mdb-ripple-init>
                                  <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                        </td>
                    </tr>
                `;
            });
            document.getElementById('userRows').innerHTML = rows;
            renderPagination(totalPages, page);
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

function treatSuccessCreateOrUpdateUser(form, mailError) {
    form.reset();
    mailError.style.display = 'none';
    form.classList.remove('was-validated')
    fetchUsers();
    document.getElementById("btn-close").click();
}

function treatFailureCreateOrUpdateUser(usernameInputText, mailError, response) {
    //usernameInputText.setCustomValidity(response.message);
    usernameInputText.classList.add('is-invalid');
    mailError.style.display = 'block';
    mailError.innerText = response.message;
}

export function addUser() {
    event.preventDefault(); // Empêche la soumission par défaut
    const form = document.getElementById('userForm');
    const passwdInputText = document.getElementById("passwd");
    const confirmInputText = document.getElementById("confirm");
    const passwdError = document.getElementById('passwdError');
    const confirmError = document.getElementById('confirmError');
    const mailError = document.getElementById('mailError');
    const usernameInputText = document.getElementById("username");
    const idInputText = document.getElementById("id");
    confirmInputText.setCustomValidity('');
    confirmInputText.classList.remove('is-invalid');
    confirmError.style.display = 'none';
    const idUser = idInputText.value;
    if (idUser) {
        passwdInputText.required = false;
        confirmInputText.required = false;
    }
    if (form.checkValidity() === false) {
        event.stopPropagation();
    } else if (!idUser && passwdInputText.value !== confirmInputText.value) {
        confirmInputText.setCustomValidity('Les mots de passe ne correspondent pas');
        confirmInputText.classList.add('is-invalid');
        confirmError.style.display = 'block';
        event.preventDefault();
        event.stopPropagation();
    } else {
        confirmInputText.setCustomValidity('');
        confirmInputText.classList.remove('is-invalid');
        confirmError.style.display = 'none';

        const nomInputText = document.getElementById("nom");
        const prenomInputText = document.getElementById("prenom");
        const roleSelect = document.getElementById("roles");

        const itemAdd = {
            username: usernameInputText.value.trim(),
            nom: nomInputText.value.trim(),
            prenom: prenomInputText.value.trim(),
            role: roleSelect.value,
            password: passwdInputText.value.trim(),
        }
        if (idUser) {
            const itemUpdate = {
                username: usernameInputText.value.trim(),
                nom: nomInputText.value.trim(),
                prenom: prenomInputText.value.trim(),
                role: roleSelect.value,
            }
            api.put(`/users/${idUser}`, itemUpdate).then((response) => {
                if (response.userId) {
                    treatSuccessCreateOrUpdateUser(form, mailError);
                } else {
                    if (response.message) {
                        treatFailureCreateOrUpdateUser(usernameInputText, mailError, response);
                    }
                }
            })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        } else {
            api.post(`/users/`, itemAdd)
                .then((response) => {
                    if (response.userId) {
                        treatSuccessCreateOrUpdateUser(form, mailError);
                    } else {
                        if (response.message) {
                            treatFailureCreateOrUpdateUser(usernameInputText, mailError, response);
                        }
                    }
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    }
    form.classList.add('was-validated');
}

export function showInputsPasswd() {
    document.getElementById('passwd').style.display = "block";
    document.getElementById('confirm').style.display = "block";
    document.querySelector('[for="passwd"]').style.display = "block";
    document.querySelector('[for="confirm"]').style.display = "block";
}

function renderPagination(totalPages, currentPage) {
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.classList.add('page-item');
        if (i === currentPage) {
            li.classList.add('active');
        }
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener('click', (event) => {
            event.preventDefault();
            fetchUsers(i);
        });
        paginationElement.appendChild(li);
    }
}