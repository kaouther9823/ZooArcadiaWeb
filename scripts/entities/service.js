import {api} from '/scripts/common/api.js';
import {INIT_PAGE, ITEM_PER_PAGE} from "/scripts/common/commun.js";

export function editService(id) {
    api.get(`/services/${id}`)
        .then(service => {
            document.getElementById('addModalLabel').innerText = "Editer un service";
            document.getElementById('id').value = service.serviceId;
            document.getElementById('name').value = service.nom;
            document.getElementById('description').value = service.description;
            const editModal = new bootstrap.Modal(document.getElementById('addModal'), {
                keyboard: false
            });
            editModal.show();
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}


export function fetchServices(page = INIT_PAGE, servicesPerPage = ITEM_PER_PAGE) {
    api.get('/services/images/list')
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
                        <td><img src = "data:image/jpeg;base64,${service.imageData}" alt="" height=100 width=100 />
                        <td
                        <div class="btn-group" role="group" aria-label="Actions">
                            <button class="btn btn-primary btn-floating  me-2" aria-label="Modifier" title="Modifier" onclick="editService(${service.serviceId})" data-mdb-ripple-init>
                                  <i class="fa-solid fa-pencil"></i>
                            </button>
                            <button class="btn btn-danger btn-floating" aria-label="Supprimer" title="Supprimer" onclick="deleteService(${service.serviceId})" data-mdb-ripple-init>
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

function treatSuccessCreateOrUpdateService(files, data, formData) {
    if (files && files.length > 0) {
        api.uploadImages(`/services/${data.serviceId}/upload`, formData)
            .then( () => fetchServices())
            .catch(error => {
                console.error('Error:', error);
            });
    } else {
        fetchServices()
    }
    form.reset();
    form.classList.remove('was-validated')
    document.getElementById("btn-close").click();
}

export function addService() {
    const idInputText = document.getElementById("id");
    const idService = idInputText.value;
    if (idService) {
        document.getElementById('images').required = false;
    }
    event.preventDefault(); // Empêche la soumission par défaut
    const form = document.getElementById('serviceForm');
    if (form.checkValidity() === false) {
        event.stopPropagation();
    } else {
        const nameInputText = document.getElementById("name");
        const descriptionInputText = document.getElementById("description");
        // upload images
        const formData = new FormData();
        const files = document.getElementById('images').files;
        formData.append('image', files[0]);
        formData.append('imageName', files[0].name);

        const item = {
            nom: nameInputText.value.trim(),
            description: descriptionInputText.value.trim(),
       //     imagePath: 'services/' + data.filename
        };
                if (idService) {
                    api.put(`/services/${idService}`, item)
                        .then((data) => {
                            //document.getElementById("btn-close").click();
                            treatSuccessCreateOrUpdateService(files, data, formData, form);
                        })
                        .catch(error => {
                            console.error('There was an error!', error);
                        });

                } else {
                    api.post(`/services/`, item)
                        .then((data) => {
                            treatSuccessCreateOrUpdateService(files, data, formData, form);
                        })
                        .catch(error => {
                            console.error('There was an error!', error);
                        });
                }
    }
    form.classList.add('was-validated');
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