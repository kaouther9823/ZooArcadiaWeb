import {api} from '/scripts/common/api.js';
import {INIT_PAGE, ITEM_PER_PAGE} from "/scripts/common/commun.js";

export function editAnimal(id) {
    api.get(`/animaux/${id}`)
        .then(animal => {
            document.getElementById('addModalLabel').innerText = "Editer un animal";
            document.getElementById('animal-id').value = animal.id;
            document.getElementById('animal-prenom').value = animal.prenom;
            document.getElementById('animal-etat').value = animal.etat.id;
            document.getElementById('animal-race').value = animal.race.id;
            if (document.getElementById('animal-habitat')) {
                document.getElementById('animal-habitat').value = animal.habitat.id;
            }
            if (document.getElementById('animalModal')) {
                const animalModal = new bootstrap.Modal(document.getElementById('animalModal'), {
                    keyboard: false
                });
                animalModal.show();
            }
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}

export function fetchAnimaux(habitatId, page = INIT_PAGE, animauxPerPage = ITEM_PER_PAGE) {
    const urlArray = location.pathname.split("/");
    const idHabitat = urlArray[urlArray.length - 1];
    let url;
    if (!isNaN(idHabitat) && idHabitat !== "") {
        url = `/animaux/habitat/${idHabitat}`;
    } else {
        url = `/animaux`;
    }
    api.get(`${url}`)
        .then(animaux => {
            const totalServices = animaux.length;
            const totalPages = Math.ceil(totalServices / animauxPerPage);
            const offset = (page - 1) * animauxPerPage;
            const paginatedServices = animaux.slice(offset, offset + animauxPerPage);
            let rows = '';
            paginatedServices.forEach(animal => {
                rows += `
                    <tr>
                        <td>${animal.prenom}</td>
                        <td>${animal.race.label}</td>`;
                if (!habitatId) {
                    rows += `<td>${animal.habitat.nom}</td>`;
                }
                rows += `<td>${animal.etat.label}</td>
                        <td><img id="animal-${animal.id}-1" alt="" height=100 width=100 />
                        <td>
                        <div class="btn-group" role="group" aria-label="Actions">
                            <button class="btn btn-primary btn-floating  me-2" aria-label="Modifier" title=Modifier" onclick="editAnimal(${animal.id})" data-mdb-ripple-init>
                                  <i class="fa-solid fa-pencil"></i>
                            </button>
                            <button class="btn btn-danger btn-floating" aria-label="Supprimer" title="Supprimer" onclick="deleteAnimal(${animal.id})" data-mdb-ripple-init>
                                  <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                        </td>
                    </tr>`;
                document.getElementById('animalRows').innerHTML = rows;
                renderPagination(habitatId, totalPages, page);
                listImagesByAnimal(animal.id).then(data => {
                    if (data && data.length > 0) {
                        const imageId = data[data.length-1].imageId;
                        getImageById(imageId).then(image => {
                            const idImageComponent = 'animal-' + image.animalId + '-1';
                            const imgElement = document.getElementById(idImageComponent);
                            imgElement.src = 'data:image/jpeg;base64,' + image.base64Data;
                        }).catch(error => {
                            console.error('There was an error!', error);
                        });
                    }
                })
            });
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}

export function deleteAnimal(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet animal ?')) {
        api.delete(`/animaux/${id}`)
            .then(() => {
                fetchAnimaux();
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
}

export function listImagesByAnimal(id) {
    return api.get(`/animaux/${id}/images`);
}


export function getImageById(id) {
    return api.get(`/animaux/images/${id}`);

}

export function addAnimalInHabitatView() {
    event.preventDefault(); // Empêche la soumission par défaut
    const idAnimalInput = document.getElementById("animal-id");
    const idAnimal  = idAnimalInput.value;
    if (idAnimal){
        document.getElementById("animal-images").required=false
    }

    const form = document.getElementById('animalForm');
    if (form.checkValidity() === false) {
        event.stopPropagation();
    } else {
        const urlArray = location.pathname.split("/");
        const idHabitat = urlArray[urlArray.length - 1];
        if (!isNaN(idHabitat) && idHabitat !== "") {
            const name = document.getElementById("animal-prenom");
            const race = document.getElementById("animal-race");
            const etat = document.getElementById("animal-etat");

            const item = {
                prenom: name.value.trim(),
                etatId: etat.value.trim(),
                raceId: race.value.trim(),
                habitatId: idHabitat,
            };
            persistAnimal(idAnimal, item, form);
        }
    }
    form.classList.add('was-validated');
}


export function addAnimal() {
    event.preventDefault(); // Empêche la soumission par défaut
    const idAnimalInput = document.getElementById("animal-id");
    const idAnimal  = idAnimalInput.value;
    if (idAnimal){
        document.getElementById("animal-images").required=false
    }
    const form = document.getElementById('animalForm');
    if (form.checkValidity() === false) {
        event.stopPropagation();
    } else {
            const name = document.getElementById("animal-prenom");
            const race = document.getElementById("animal-race");
            const habitat = document.getElementById("animal-habitat");
            const etat = document.getElementById("animal-etat");
            // upload images

            const item = {
                prenom: name.value.trim(),
                etatId: etat.value.trim(),
                raceId: race.value.trim(),
                habitatId: habitat.value.trim(),
            };
        persistAnimal(idAnimal, item, form);
    }
    form.classList.add('was-validated');
}

export function renderPagination(habitatId, totalPages, currentPage) {
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
            fetchAnimaux(habitatId, i);
        });
        paginationElement.appendChild(li);
    }
}

function persistAnimal(idAnimal, item, form) {

    const formData = new FormData();
    const files = document.getElementById('animal-images').files;
    for (let i = 0; i < files.length; i++) {
        formData.append('images[]', files[i]);
    }
    if (idAnimal && idAnimal !== "") {
        api.put(`/animaux/${idAnimal}`, item)
            // .then(response => response.json())
            .then(data => {
                if (formData || formData.entries().next().value) {
                    api.uploadImages(`/animaux/${data.id}/upload`, formData)
                        .then(response => console.log(response))
                        .catch(error => {
                            console.error('There was an error!', error);
                        });
                }
                fetchAnimaux();
                document.getElementById("btn-close-animal-modal").click();
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    } else {
        api.post(`/animaux/`, item)
            // .then(response => response.json())
            .then(data => {
                if (formData || formData.entries().next().value) {
                    api.uploadImages(`/animaux/${data.id}/upload`, formData)
                        .then(response => console.log(response))
                        .catch(error => {
                            console.error('There was an error!', error);
                        });
                }
                form.reset();
                form.classList.remove('was-validated')
                fetchAnimaux();
                document.getElementById("btn-close-animal-modal").click();
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
}