export const API_BASE_URL = 'http://localhost:8000/api';
export const SERVEUR_URL = 'http://localhost:8000';
const token = localStorage.getItem('jwt');
export const headers = {
    'Content-Type': 'application/json'
}
export const authorization = {
    'Authorization': `Bearer ${token}`
};
if (token !== "") {
    headers.Authorization = `Bearer ${token}`;
}

export const api = {
    get: function (url) {
        return fetch(`${API_BASE_URL}${url}`, {
            method: 'GET',
            headers
        }).then(response => response.json());
    },
    post: function (url, data) {
        return fetch(`${API_BASE_URL}${url}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        }).then(response => response.json());
    },
    put: function (url, data) {
        return fetch(`${API_BASE_URL}${url}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data)
        }).then(response => response.json());
    },
    delete: function (url) {
        return fetch(`${API_BASE_URL}${url}`, {
            method: 'DELETE',
            headers: authorization,
        }).then();
    },
    uploadImages: function (url, formData) {
        console.log(formData);
        return fetch(`${API_BASE_URL}${url}`, {
            method: 'POST',
            headers: authorization,
            body: formData
        })
            .then(data => {
                data.json();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    },
};

