// Fichier: /scripts/common/api.js
//
//
export const API_BASE_URL = 'http://localhost:8000/api';
export const api = {
    get: function(url) {
        return fetch(`${API_BASE_URL}${url}`).then(response => response.json());
    },
    post: function(url, data) {
        return fetch(`${API_BASE_URL}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json());
    },
    put: function(url, data) {
        return fetch(`${API_BASE_URL}${url}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json());
    },
    delete: function(url) {
        return fetch(`${API_BASE_URL}${url}`, {
            method: 'DELETE'
        }).then(response => response.json());
    },
    uploadImages: function (url, formData) {
        console.log(formData);
        return     fetch(`${API_BASE_URL}${url}`, {
            method: 'POST',
            body: formData
        })
            .then(data => {
                data.json();
                document.getElementById('uploadResult').innerHTML = `<div class="alert alert-success">Images uploaded successfully!</div>`;
            })
            .catch(error => {
                document.getElementById('uploadResult').innerHTML = `<div class="alert alert-danger">Error uploading images.</div>`;
                console.error('Error:', error);
            });
    }

};
