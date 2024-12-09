export const API_BASE_URL = 'http://localhost:8000/api';
export const SERVEUR_URL = 'http://localhost:8000';
export const headers =
    {   'Content-Type': 'application/json'
}


export const api = {
    get: function (url) {
        return fetch(`${API_BASE_URL}${url}`, {
            method: 'GET',
            headers, credentials: 'include'
        }).then(response => response.json());
    },
    post: async function (url, data, route = null) {
        if (route) {
            const csrfToken = await fetchCsrfToken(route);
            headers.push({'X-CSRF-Token': csrfToken});
        }

        return fetch(`${API_BASE_URL}${url}`, {
            method: 'POST',
            headers, credentials: 'include',
            body: JSON.stringify(data)
        }).then(response => response.json());
    },
    put: async function (url, data, route) {
        if (route) {
            const csrfToken = await fetchCsrfToken(route);
            headers.push({'X-CSRF-Token': csrfToken});
        }
        return fetch(`${API_BASE_URL}${url}`, {
            method: 'PUT',
            headers, credentials: 'include',
            body: JSON.stringify(data)
        }).then(response => response.json());
    },
    delete: async function (url, route) {
        if (route) {
            const csrfToken = await fetchCsrfToken(route);
            headers.push({'X-CSRF-Token': csrfToken});
        }
        return fetch(`${API_BASE_URL}${url}`, {
            method: 'DELETE', credentials: 'include',
        }).then();
    },
    uploadImages: function (url, formData) {
        console.log(formData);
        return fetch(`${API_BASE_URL}${url}`, {
            method: 'POST', credentials: 'include',
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

async function fetchCsrfToken(route) {
    const response = await fetch(`${API_BASE_URL}/${route}/csrf/token`);
    const data = await response.json();
    return data.csrf_token; // Sauvegarder le token pour une utilisation ultérieure
}
