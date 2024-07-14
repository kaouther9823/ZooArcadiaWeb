import { api } from '/scripts/common/api.js';

export function showHabitat(HabitatId) {
    editHabitat(HabitatId);
    listImageByHabitat(HabitatId).then(data => {
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

function editHabitat(id) {
    api.get(`/habitats/${id}`)
        .then(habitat => {
            document.getElementById('idHabitat').value = habitat.id;
            document.getElementById('nom').value = habitat.nom;
            document.getElementById('description').value = habitat.description;
            document.getElementById('nomHabitat').innerHTML = habitat.nom;
        })
        .catch(error => console.error('Error fetching habitat:', error));
}

export function fetchHabitats() {
    api.get('/habitats')
        .then(habitats => {
            const habitatTable = document.getElementById('habitatRows');
            habitatTable.innerHTML = habitats.map(habitat => createHabitatRow(habitat)).join('');
            habitats.forEach(habitat => {
                listImageByHabitat(habitat.habitatId).then(data => {
                    if (data && data.length > 0) {
                        const imageId = data[0].imageId;
                        getImageById(imageId).then(image => {
                            const imgElement = document.getElementById(`habitat-${image.habitatId}-1`);
                            imgElement.src = `data:image/jpeg;base64,${image.base64Data}`;
                        }).catch(error => console.error('Error fetching image:', error));
                    }
                }).catch(error => console.error('Error fetching images by habitat:', error));
            });
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
                    <button class="btn btn-primary btn-floating me-2" aria-label="Modifier" onclick="editHabitat(${habitat.habitatId})" data-mdb-ripple-init>
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <a class="btn btn-primary btn-floating me-2" aria-label="Modifier" href="/admin/habitat/${habitat.habitatId}" data-mdb-ripple-init>
                        <i class="fa-solid fa-pencil"></i>
                    </a>
                    <button class="btn btn-danger btn-floating" aria-label="Supprimer" onclick="deleteHabitat(${habitat.habitatId})" data-mdb-ripple-init>
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
}

export function deleteHabitat(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce habitat ?')) {
        api.delete(`/habitats/${id}`)
            .then(() => fetchHabitats())
            .catch(error => console.error('Error deleting habitat:', error));
    }
}

export function addHabitat() {
    const nameInputText = document.getElementById('add-name');
    const descriptionInputText = document.getElementById('add-description');

    const habitatItem = {
        nom: nameInputText.value.trim(),
        description: descriptionInputText.value.trim()
    };

    const formData = new FormData();
    const files = document.getElementById('add-images').files;
    Array.from(files).forEach(file => formData.append('images[]', file));

    api.post('/habitats/', habitatItem)
        .then(data => {
            return api.uploadImages(`/habitats/${data.habitatId}/upload`, formData);
        })
        .then(response => {
            console.log(response);
            fetchHabitats();
            document.getElementById('btn-close').click();
        })
        .catch(error => console.error('Error adding habitat:', error));
}

export function updateHabitat() {
    const idInputText = document.getElementById('edit-id');
    const nameInputText = document.getElementById('edit-nom');
    const descriptionInputText = document.getElementById('edit-description');

    const habitatItem = {
        id: idInputText.value,
        nom: nameInputText.value.trim(),
        description: descriptionInputText.value.trim()
    };

    const formData = new FormData();
    const files = document.getElementById('edit-images').files;
    Array.from(files).forEach(file => formData.append('images[]', file));

    api.put(`/habitats/${idInputText.value}`, habitatItem)
        .then(() => {
            return api.uploadImages(`/habitats/${idInputText.value}/upload`, formData);
        })
        .then(response => {
            console.log(response);
            fetchHabitats();
            document.getElementById('btn-close').click();
        })
        .catch(error => console.error('Error updating habitat:', error));
}

function listImageByHabitat(id) {
    return api.get(`/habitats/${id}/images`);
}

function getImageById(id) {
    return api.get(`/habitats/images/${id}`);
}
