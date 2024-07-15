import {api, API_BASE_URL} from '/scripts/common/api.js';

export function editService(id) {
    api.get(`/services/${id}`)
        .then(service => {
            document.getElementById('edit-id').value = service.serviceId;
            document.getElementById('edit-nom').value = service.nom;
            document.getElementById('edit-description').value = service.description;
            const editModal = new bootstrap.Modal(document.getElementById('editModal'), {
                keyboard: false
            });
            editModal.show();
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}


export function fetchServices(page = 1, servicesPerPage = 5) {
    api.get('/services')
        .then(services => {
            const totalServices = services.length;
            const totalPages = Math.ceil(totalServices / servicesPerPage);
            const offset = (page - 1) * servicesPerPage;
            const paginatedServices = services.slice(offset, offset + servicesPerPage);
            let rows = '';
            paginatedServices.forEach(service => {
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
            document.getElementById('serviceRows').innerHTML = rows;
            renderPagination(totalPages, page);
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
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
            fetchServices(i);
        });
        paginationElement.appendChild(li);
    }
}

export function deleteService(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
        api.delete(`/services/${id}`)
            .then(() => {
                fetchServices();
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
}

export function addService() {
    event.preventDefault(); // Empêche la soumission par défaut
    const form = document.getElementById('serviceForm');
    if (form.checkValidity() === false) {
        event.stopPropagation();
    } else {
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
                    .then(() => {
                        form.reset();
                        form.classList.remove('was-validated')
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
    form.classList.add('was-validated');
}
export function updateService() {
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
                .then(() => {
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


