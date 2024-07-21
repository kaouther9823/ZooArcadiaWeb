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

export function login() {
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
                    localStorage.setItem("jwt", response.token);
                    showAndHideElementsForRoles();
                    redirectToHomePage();
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
}

export function showAndHideElementsForRoles() {
    const userConnected = isConnected();
    const role = getRole();

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


function redirectToHomePage() {
    switch (getRole()) {
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
    localStorage.removeItem('jwt');
    window.location.href = '/';
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export function isConnected() {
    return localStorage.getItem("jwt") !== null;
}

export function getRole() {
    if (isConnected()) {
        const parsedToken = parseJwt(localStorage.getItem("jwt"));
        return parsedToken.roles[0];
    }
}

export function loadUserInfos(){

    if (isConnected()) {
        setTimeout(() => {
        const parsedToken = parseJwt(localStorage.getItem('jwt'))
        document.getElementById('inputNom').value = parsedToken.lastname;
        document.getElementById('inputPrenom').value = parsedToken.firstname;
        document.getElementById('inputEmail').value = parsedToken.username;
        document.getElementById('inputRole').value = parsedToken.roles;
    }, 100)}
}