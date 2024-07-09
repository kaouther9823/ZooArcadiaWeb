const API_BASE_URL = 'http://127.0.0.1:8000/api';
const api = {
    get: function (url) {
        return fetch(`${API_BASE_URL}${url}`).then(response => response.json());
    },
    post: function (url, data) {
        return fetch(`${API_BASE_URL}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json());
    },
    put: function (url, data) {
        return fetch(`${API_BASE_URL}${url}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json());
    },
    delete: function (url) {
        return fetch(`${API_BASE_URL}${url}`, {
            method: 'DELETE'
        }).then();
    }
};

document.addEventListener('DOMContentLoaded', function () {
    if (location.pathname === "/admin/services") {
        console.log("dom content loaded succefully!")
        fetchServices();
    }
});

function editService(id) {
    api.get(`/services/${id}`)
        .then(service => {
            console.log(document.getElementById('edit-id'));
            console.log(document.getElementById('edit-nom'));
            console.log(document.getElementById('edit-description'));
            document.getElementById('edit-id').value = service.serviceId;
            document.getElementById('edit-nom').value = service.nom;
            document.getElementById('edit-description').value = service.description;
            var editModal = new bootstrap.Modal(document.getElementById('editModal'), {
                keyboard: false
            });
            editModal.show();
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}

function fetchServices() {
    api.get('/services')
        .then(services => {
            let rows = '';
            services.forEach(service => {
                rows += `
                    <tr>
                        <td>${service.nom}</td>
                        <td>${service.description}</td>
                        <td><img src="/images/${service.imagePath}" alt="" height=100 width=100 />
                        <td>
                        <div class="btn-group" role="group" aria-label="Actions">
                            <button class="btn btn-primary btn-floating  me-2" aria-label="Modifier" onclick="editService(${service.serviceId})" data-mdb-ripple-init>
                                  <i class="fa-solid fa-pencil"></i>
                            </button>
                            <button class="btn btn-danger btn-floating" aria-label="Supprimer" onclick="deleteService(${service.serviceId})" data-mdb-ripple-init>
                                  <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                        </td>
                    </tr>
                `;
            });
            document.getElementById('serviceTable').innerHTML = rows;
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}

function deleteService(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
        api.delete(`/services/${id}`)
            .then(data => {
                fetchServices();
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
}

function addService() {
    const nameInputText = document.getElementById("add-name");
    const descriptionInputText = document.getElementById("add-description");
    // upload images
    const formData = new FormData();
    const files = document.getElementById('add-images').files;
    formData.append('image', files[0]);
    formData.append('imageName', files[0].name);

    fetch(`${API_BASE_URL}/images/upload`, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('uploadResult').innerHTML = `<div class="alert alert-success">Images uploaded successfully!</div>`;
            const item = {
                nom: nameInputText.value.trim(),
                description: descriptionInputText.value.trim(),
                imagePath: 'services/' + data.filename
            };
            api.post(`/services/`, item)
                .then(data => {
                    fetchServices();
                    document.getElementById("btn-close").click();
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        })
        .catch(error => {
            document.getElementById('uploadResult').innerHTML = `<div class="alert alert-danger">Error uploading images.</div>`;
            console.error('Error:', error);
        });
}

function updateService() {
    const idInputText = document.getElementById("edit-id");
    const nameInputText = document.getElementById("edit-nom");
    const descriptionInputText = document.getElementById("edit-description");
    // upload images
    const formData = new FormData();
    const files = document.getElementById('edit-images').files;
    formData.append('image', files[0]);
    formData.append('imageName', files[0].name);
    const item = {
        id: idInputText.value,
        nom: nameInputText.value.trim(),
        description: descriptionInputText.value.trim(),
    };
    fetch(`${API_BASE_URL}/images/upload`, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('uploadResult').innerHTML = `<div class="alert alert-success">Images uploaded successfully!</div>`;
            const item = {
                nom: nameInputText.value.trim(),
                description: descriptionInputText.value.trim(),
                imagePath: 'services/' + data.filename
            };
            api.put(`/services/${idInputText.value}`, item)
                .then(data => {
                    fetchServices();
                    document.getElementById("btn-close").click();
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        })
        .catch(error => {
            document.getElementById('uploadResult').innerHTML = `<div class="alert alert-danger">Error uploading images.</div>`;
            console.error('Error:', error);
        });

}


