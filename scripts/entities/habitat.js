import {fetchAnimaux} from "/scripts/entities/animal.js";

let API_BASE_URL = "http://localhost:8001/api";
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

/*
document.addEventListener('DOMContentLoaded', function () {
    const urlArray = location.pathname.split("/");
    if (location.pathname === "/admin/habitats") {
        console.log("dom content loaded succefully!")
        fetchHabitats();
    }
});
*/

export function showHabitat(HabitatId){
    editHabitat(HabitatId);
    listImageByHabitat(HabitatId).then(data => {
        if (data && data.length > 0) {

            const listImagesContainer = document.getElementById('listImages');

            data.forEach((image, index) => {

                const imageCard = document.createElement('div');
                imageCard.classList.add('col', 'p-3', 'image-card', 'text-white');

                const img = document.createElement('img');
                img.classList.add('img-fluid', 'rounded', 'd-block', 'w-100');
                img.alt = `habitat-${image.imageId}`;
                img.src = 'data:image/jpeg;base64,' + image.base64Data;

                const btn = document.createElement('button');
                img.classList.add('.btn-del');
                imageCard.appendChild(img);
                imageCard.appendChild(btn);
                listImagesContainer.appendChild(imageCard);
            });
        }
    })
}

function editHabitat(id) {
    api.get(`/habitats/${id}`)
        .then(habitat => {
            document.getElementById('idHabitat').value = habitat.id;
            document.getElementById('nom').value = habitat.nom;
            document.getElementById('description').value = habitat.description;
            document.getElementById('nomHabitat').innerHTML = habitat.nom;
          //  var editModal = new bootstrap.Modal(document.getElementById('editModal'), {
          //      keyboard: false
            //});
           // editModal.show();

        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}

export function fetchHabitats() {
    api.get(`/habitats`)
        .then(habitats => {
            let rows = '';
            habitats.forEach(habitat => {
                rows += `
                    <tr>
                        <td>${habitat.nom}</td>
                        <td>${habitat.description}</td>
                        <td><img id="habitat-${habitat.id}-1" alt="" height=100 width=100 />
                        <td>
                        <div class="btn-group" role="group" aria-label="Actions">
                            <button class="btn btn-primary btn-floating  me-2" aria-label="Modifier" onclick="editHabitat(${habitat.habitatId})" data-mdb-ripple-init>
                                  <i class="fa-solid fa-pencil"></i>
                            </button>
                             <a class="btn btn-primary btn-floating  me-2" aria-label="Modifier" href="/admin/habitat/${habitat.habitatId}" data-mdb-ripple-init>
                                  <i class="fa-solid fa-pencil"></i>
                            </a>
                            <button class="btn btn-danger btn-floating" aria-label="Supprimer" onclick="deleteHabitat(${habitat.habitatId})" data-mdb-ripple-init>
                                  <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                        </td>
                    </tr>
                `;

                    listImageByHabitat(habitat.habitatId).then(data => {
                        if (data && data.length >0) {
                            const imageId = data[0].imageId;
                            const habitatId = data[0].habitatId;
                            getImageById(imageId).then(image => {
                                const idImageComponent = 'habitat-' + image.habitatId +'-1';
                                const imgElement = document.getElementById(idImageComponent);
                                imgElement.src = 'data:image/jpeg;base64,'+image.base64Data;
                            }).catch(error => {
                                console.error('There was an error!', error);
                            });
                        }
                    })
            });
            document.getElementById('habitatTable').innerHTML = rows;
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}

export function deleteHabitat(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce habitat ?')) {
        api.delete(`/habitats/${id}`)
            .then(data => {
                fetchHabitats();
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
}

export function addHabitat() {
    const nameInputText = document.getElementById("add-name");
    const descriptionInputText = document.getElementById("add-description");
    // upload images

    const habitatItem = {
        nom: nameInputText.value.trim(),
        description: descriptionInputText.value.trim(),
    };
    const formData = new FormData();
    const files = document.getElementById('add-images').files;
    for (let i = 0; i < files.length; i++) {
        formData.append('images[]', files[i]);
    }
    api.post(`/habitats/`, habitatItem)
        .then(data => {
            api.uploadImages(`/habitats/${data.habitatId}/upload`, formData)
                .then(response => console.log(response))
                .catch(error => { console.error('There was an error!', error);});
            fetchHabitats();
            document.getElementById("btn-close").click();
            })
                .catch(error => {
                    console.error('There was an error!', error);
                });
}

export function updateHabitat() {
    // extract form input habitat
    const idInputText = document.getElementById("edit-id");
    const nameInputText = document.getElementById("edit-nom");
    const descriptionInputText = document.getElementById("edit-description");
    // upload images
    const formData = new FormData();
    const files = document.getElementById('edit-images').files;
    formData.append('image', files[0]);
    formData.append('imageName', files[0].name);

    const habitatItem = {
        id: idInputText.value,
        nom: nameInputText.value.trim(),
        description: descriptionInputText.value.trim(),
    };

    api.put(`/habitats/${idInputText.value}`, habitatItem)
        .then(data => {
            api.uploadImages(`/habitats/${idInputText.value}/upload`, formData).then(response => console.log(response)).catch(error => { console.error('There was an error!', error);});
            fetchHabitats();
            document.getElementById("btn-close").click();
        })
        .catch(error => {
            console.error('There was an error!', error);
        });

}

function listImageByHabitat(id){
    return api.get(`/habitats/${id}/images`);
}


function getImageById(id){
    return api.get(`/habitats/images/${id}`);

}
