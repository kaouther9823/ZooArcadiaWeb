/*
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        document.getElementById('loginForm').addEventListener('submit', async function (event) {
            await login();
        }), 2000;
    });
});
*/


import {API_BASE_URL} from "/scripts/common/api.js";

export async function login(username, password) {
    event.preventDefault();
    const form = document.getElementById('loginForm');
    if (form.checkValidity() === false) {
        event.stopPropagation();
    } else {
        const username = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');

        try {
            // Étape 1 : Authentification
            const loginResponse = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password}),
                credentials: "include"
            });

            const loginData = await loginResponse.json();

            if (loginData.status !== "success") {
                errorMessage.textContent = loginData.message || "Login failed.";
                return;
            }

            // Étape 2 : Vérification du statut d'authentification
            const statusResponse = await fetch(`${API_BASE_URL}/status`, {
                method: 'GET',
                credentials: 'include', // JWT via cookie HTTPOnly
            });

            const statusData = await statusResponse.json();

            if (statusData.authenticated) {
                showAndHideElementsForRoles(statusData);
                redirectToHomePage(statusData);
            } else {
                errorMessage.textContent = statusData.message || "Authentication failed.";
            }
        } catch (error) {
            console.error('An error occurred:', error);
            errorMessage.textContent = "An unexpected error occurred.";
        }

    }
}


/*export function login() {
    event.preventDefault();
    const form = document.getElementById('loginForm');
    if (form.checkValidity() === false) {
        event.stopPropagation();
    } else {
        const username = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');

        fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        })
            .then(response => response.json())
            .then(response => {
                if (response.status === "success") {
                    //localStorage.setItem("jwt", response.token);
                    fetch(`${API_BASE_URL}/status`, {
                        method: 'GET',
                        credentials: 'include' // Inclure les cookies (JWT stocké dans un cookie HTTPOnly)
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.authenticated) {
                                showAndHideElementsForRoles(data);
                                redirectToHomePage(data);
                            } else {
                                const result = response.message;
                                errorMessage.textContent = result.message;
                            }})
                } else {
                    const result = response.message;
                    errorMessage.textContent = result.message;
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
    form.classList.add('was-validated');
}*/
export function updateMenu() {
    fetch(`${API_BASE_URL}/status`, {
        method: 'GET',
        credentials: 'include' // Inclure les cookies (JWT stocké dans un cookie HTTPOnly)
    })
        .then(response => response.json())
        .then(data => {
            if (data.authenticated) {
                showAndHideElementsForRoles(data);
            } else {
                showAndHideElementsForVisitor()
                console.log(data.error);
            }})
}

export function showAndHideElementsForVisitor() {
    let allElementsToEdit = document.querySelectorAll('[data-show]');
    allElementsToEdit.forEach(element => {
        switch (element.dataset.show) {
            case 'connected':
            case 'admin':
            case 'employe':
            case 'veterinaire':
                element.classList.add("d-none");
            break;
        }
    })
}

export function showAndHideElementsForRoles(data) {
    //const userConnected = isConnected();
    console.log(data);

    const userConnected = true;
    const role = data.role;//getRole();
    console.log(role);

    let allElementsToEdit = document.querySelectorAll('[data-show]');

    allElementsToEdit.forEach(element => {
        switch (element.dataset.show) {
            case 'disconnected':
            case 'visiteur':
                if (userConnected) {
                    element.classList.add("d-none");
                }
                break;
            case 'connected':
                if (!userConnected) {
                    element.classList.add("d-none");
                }
                break;
            case 'admin':
                if (!userConnected || role !== "ROLE_ADMIN") {
                    element.classList.add("d-none");
                }
                break;
            case 'employe':
                if (!userConnected || role !== "ROLE_EMPLOYE") {
                    element.classList.add("d-none");
                }
                break;
            case 'veterinaire':
                if (!userConnected || role !== "ROLE_VETERINAIRE") {
                    element.classList.add("d-none");
                }
                break;
        }
    })
}


function redirectToHomePage(data) {
    switch (data.role) {
        case 'ROLE_ADMIN':
            window.location.href = '/';
            break
        case 'ROLE_EMPLOYEE':
            window.location.href = '/';
            break;
        case 'ROLE_VETERINAIRE':
            window.location.href = '/';
            break
        default:
            window.location.href = '/';
            break;
    }
}

export function logout() {
    //localStorage.removeItem('jwt');
    fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
    })
        .then(() => {
            // Rediriger vers la page de connexion après la déconnexion
            window.location.href = '/';
        })
        .catch(error => {
            console.error('Erreur lors de la déconnexion:', error);
        });
}

/*function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}*/

//export function isConnected() {
//    return localStorage.getItem("jwt") !== null;
//}

/* export function getRole() {
   if (isConnected()) {
        const parsedToken = parseJwt(localStorage.getItem("jwt"));
        return parsedToken.roles[0];
    }
}*/

export function loadUserInfos(){

    fetch(`${API_BASE_URL}/status`, {
        method: 'GET',
        credentials: 'include' // Inclure les cookies (JWT stocké dans un cookie HTTPOnly)
    })
        .then(response => response.json())
        .then(data => {
            if (data.authenticated) {
                document.getElementById('inputNom').value = data.lastname;
                document.getElementById('inputPrenom').value = data.firstname;
                document.getElementById('inputEmail').value = data.username;
                document.getElementById('inputRole').value = data.roles;
            } else {
                const result = response.message;
                errorMessage.textContent = result.message;
            }})
/*        setTimeout(() => {
        const parsedToken = parseJwt(localStorage.getItem('jwt'))
        document.getElementById('inputNom').value = parsedToken.lastname;
        document.getElementById('inputPrenom').value = parsedToken.firstname;
        document.getElementById('inputEmail').value = parsedToken.username;
        document.getElementById('inputRole').value = parsedToken.roles;
    }, 100)}*/
}