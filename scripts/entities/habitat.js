import {api} from '/scripts/common/api.js';
import {INIT_PAGE, ITEM_PER_PAGE} from "/scripts/common/commun.js";
const route =  "habitats"
const controllerUrl = "/habitats/"

export function showHabitat(id) {
    editHabitat(id);
    listImageByHabitat(id).then(data => {
        if (data && data.length > 0) {
            const listImagesContainer = document.getElementById('listImages');
            listImagesContainer.innerHTML = ''; // Clear previous images
            data.forEach(image => {
                listImagesContainer.appendChild(createImageCard(image));
            });
        }
    }).catch(error => console.error('Error fetching images:', error));
}

function createImageCard(image) {
    const imageCard = document.createElement('div');
    imageCard.classList.add('col', 'p-3', 'image-card', 'text-white');

    const img = document.createElement('img');
    img.classList.add('img-fluid', 'rounded', 'd-block', 'w-100');
    img.alt = `habitat-${image.imageId}`;
    img.src = `data:image/jpeg;base64,${image.base64Data}`;

    const btn = document.createElement('button');
    btn.classList.add('btn-del');

    imageCard.appendChild(img);
    imageCard.appendChild(btn);
    return imageCard;
}

export function editHabitat(id) {
    api.get(`${controllerUrl}${id}`)
        .then(habitat => {
            if (document.getElementById('addModalLabel')) {
                document.getElementById('addModalLabel').innerText = "Editer un habitat";
            }
            document.getElementById('idHabitat').value = habitat.id;
            document.getElementById('nom').value = habitat.nom;
            document.getElementById('description').value = habitat.description;
            document.getElementById('nomHabitat').innerHTML = habitat.nom;
        })
        .catch(error => console.error('Error fetching habitat:', error));
}

export function fetchHabitats(page = INIT_PAGE, habitatsPerPage = ITEM_PER_PAGE) {
    api.get(controllerUrl)
        .then(habitats => {
            const habitatTable = document.getElementById('habitatRows');
            habitatTable.innerHTML = habitats.map(habitat => createHabitatRow(habitat)).join('');
            const totalServices = habitats.length;
            const totalPages = Math.ceil(totalServices / habitatsPerPage);
            const offset = (page - 1) * habitatsPerPage;
            const paginatedHabitats = habitats.slice(offset, offset + habitatsPerPage);
            paginatedHabitats.forEach(habitat => {
                listImageByHabitat(habitat.id).then(data => {
                    if (data && data.length > 0) {
                        const imageId = data[0].imageId;
                        getImageById(imageId).then(image => {
                            const imgElement = document.getElementById(`habitat-${image.id}-1`);
                            imgElement.src = `data:image/jpeg;base64,${image.base64Data}`;
                        }).catch(error => console.error('Error fetching image:', error));
                    }
                }).catch(error => console.error('Error fetching images by habitat:', error));
            });
            renderPagination(totalPages, page);
        })
        .catch(error => console.error('Error fetching habitats:', error));
}

function createHabitatRow(habitat) {
    return `
        <tr>
            <td>${habitat.nom}</td>
            <td>${habitat.description}</td>
            <td><img id="habitat-${habitat.id}-1" alt="" height="100" width="100" /></td>
            <td>
                <div class="btn-group" role="group" aria-label="Actions">
                    <a class="btn btn-primary btn-floating me-2" aria-label="Modifier" title="Modifier" href="/admin/habitat/${habitat.id}" data-mdb-ripple-init>
                        <i class="fa-solid fa-pencil"></i>
                    </a>
                    <button class="btn btn-danger btn-floating" aria-label="Supprimer" title="Supprimer" onclick="deleteHabitat(${habitat.id})" data-mdb-ripple-init>
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
}

export function deleteHabitat(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet habitat ?')) {
        api.delete(`${controllerUrl}${id}`, route)
            .then(response => {
                console.log(response);
                fetchHabitats();
            })
            .catch(error => console.error('Error deleting habitat:', error));
    }
}

function treatFailureAddOrUpdateHabitat(form) {
    form.reset();
    form.classList.remove('was-validated')
    fetchHabitats();
    const btn = document.getElementById('btn-close');
    if (btn) { btn.click(); }
}

export function addHabitat() {

    event.preventDefault(); // Empêche la soumission par défaut
    const idHabitatInput = document.getElementById('idHabitat');
    const idHabitat = idHabitatInput.value;
    if (idHabitat){
        document.getElementById("images").required=false
    }

    const form = document.getElementById('habitatForm');
    if (form.checkValidity() === false) {
        event.stopPropagation();
    } else {
        const nameInputText = document.getElementById('nom');
        const descriptionInputText = document.getElementById('description');

        const habitatItem = {
            nom: nameInputText.value.trim(),
            description: descriptionInputText.value.trim()
        };

        const formData = new FormData();
        const files = document.getElementById('images').files;
        Array.from(files).forEach(file => formData.append('images[]', file));

        if (idHabitat) {
            api.put(`${controllerUrl}${idHabitat}`, habitatItem, route)
                .then(data => {
                    api.uploadImages(`${controllerUrl}${data.id}/upload`, formData);
                    window.location.href = '/admin/habitats';
                })
                .then(() => {
                    treatFailureAddOrUpdateHabitat(form);
                })
                .catch(error => console.error('Error adding habitat:', error));
        } else {
            api.post(controllerUrl, habitatItem, route)
                .then(data => {
                    return api.uploadImages(`${controllerUrl}${data.id}/upload`, formData);
                })
                .then(() => {
                    treatFailureAddOrUpdateHabitat(form);
                })
                .catch(error => console.error('Error adding habitat:', error));
        }
    }
    form.classList.add('was-validated');
}

export function listImageByHabitat(id) {
    return api.get(`${controllerUrl}${id}/images`);
}

function getImageById(id) {
    return api.get(`${controllerUrl}images/${id}`);
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
            fetchHabitats(i);
        });
        paginationElement.appendChild(li);
    }
}