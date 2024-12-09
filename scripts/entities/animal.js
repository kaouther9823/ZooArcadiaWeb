import {api} from '/scripts/common/api.js';
import {INIT_PAGE, ITEM_PER_PAGE} from "/scripts/common/commun.js";
const route = "animaux";

/**
 * Editer un animal
 * @param id
 */
export function editAnimal(id) {
    api.get(`/${route}/${id}`) // appel de l'api get animal
        .then(animal => {
            // charher les inputs et select de la formulaire par les valeurs des différents attributs
            document.getElementById('addModalLabel').innerText = "Editer un animal";
            document.getElementById('animal-id').value = animal.id;
            document.getElementById('animal-prenom').value = animal.prenom;
            document.getElementById('animal-etat').value = animal.etat.id;
            document.getElementById('animal-race').value = animal.race.id;
            if (document.getElementById('animal-habitat')) {
                document.getElementById('animal-habitat').value = animal.habitat.id;
            }
            // Afficher le modal d'edition avec le formulaire chargé
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

/**
 * Récupérer les animaux en fonction de l'habitat
 * @param habitatId identifiant de l'habitat
 * @param page numéro de page (pagination)
 * @param animauxPerPage nombre d'éléments par page (pagination)
 */
export function fetchAnimaux(habitatId, page = INIT_PAGE, animauxPerPage = ITEM_PER_PAGE) {
    const urlArray = location.pathname.split("/");
    const idHabitat = urlArray[urlArray.length - 1];
    let url;
    // si habitat non renseigné => retourner la liste de touts les animaux
    if (!isNaN(idHabitat) && idHabitat !== "") {
        url = `/animaux/habitat/${idHabitat}`;
    } else {
        url = `/animaux`;
    }
    api.get(`${url}`) // appel de l'api get
        .then(animaux => {
            // calcul du nombre des pages
            const totalAnimaux = animaux.length;
            const totalPages = Math.ceil(totalAnimaux / animauxPerPage);
            const offset = (page - 1) * animauxPerPage;
            const paginatedAnimaux = animaux.slice(offset, offset + animauxPerPage);
            // boucler sur les élémént de la page courrante et générer du code html
            let rows = '';
            paginatedAnimaux.forEach(animal => {
                // générer des lignes et cellules pour construire le tableau des animaux dynamiquement
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
                // injecter le code html généré dans le composant ayant l'id animalRows
                document.getElementById('animalRows').innerHTML = rows;
                // appel à la fonction renderPagination pour afficher la bar de pagination en dessous tu tableau
                renderPagination(habitatId, totalPages, page);
                // appel à la fonction listImagesByAnimal pour récupérer les images de chaque animal
                listImagesByAnimal(animal.id).then(data => {
                    if (data && data.length > 0) {
                        // afficher chaque images dynamiquement en récupéranant les données encodés en base64
                        const imageId = data[data.length - 1].imageId;
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

/**
 * Supprimer un animal en fonction de son id
 * @param id identifiant de l'animal
 */
export function deleteAnimal(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet animal ?')) {
        api.delete(`/animaux/${id}`, route) // appel à l'api delete animal
            .then(() => {
                fetchAnimaux(); // appel à la fonction fetchAnnimaux pour rafraichir la liste
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
}

/**
 * Récupérer la liste des images d'un animal en fonction de son id
 * @param id identifiant
 * @returns {Promise<*>}
 */
export function listImagesByAnimal(id) {
    return api.get(`/animaux/${id}/images`); // appel de l'api
}

/**
 * Récupérer une image d'un animal en fonction de l'id de l'image
 * @param id identifiant
 * @returns {Promise<*>}
 */
export function getImageById(id) {
    return api.get(`/animaux/images/${id}`); // appel de l'api

}

export function addAnimalInHabitatView() {
    event.preventDefault(); // Empêche la soumission par défaut
    const idAnimalInput = document.getElementById("animal-id");
    const idAnimal = idAnimalInput.value;
    if (idAnimal) {
        document.getElementById("animal-images").required = false
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

/**
 * Ajouter un nouvel animal
 */
export function addAnimal() {
    event.preventDefault(); // Empêche la soumission par défaut du formulaire
    const idAnimalInput = document.getElementById("animal-id");
    const idAnimal = idAnimalInput.value;
    if (idAnimal) {
        document.getElementById("animal-images").required = false
    }
    const form = document.getElementById('animalForm');
    if (form.checkValidity() === false) { // vérifier la validation de la formulaire
        event.stopPropagation(); // si formulaire non valide, bloquer l'appel vers le back et afficher des messages d'erreur
    } else {
        // si formulaire valide, récupération des données saisis par l'utilisateur
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
        // appeler la fonction persistAnimal pour stocker l'annimal
        persistAnimal(idAnimal, item, form);
    }
    form.classList.add('was-validated');
}

/**
 * Afficher la pagination
 * @param habitatId
 * @param totalPages
 * @param currentPage
 */
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

/**
 * Stocker les images de l'animal dans la base de données
 * @param formData
 * @param data
 */
function persistImagesAnimal(formData, data) {
    if (formData || formData.entries().next().value) {
        api.uploadImages(`/animaux/${data.id}/upload`, formData)
            .then(response => console.log(response))
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
}

/**
 * Stocker l'animal dans la base de données
 * @param idAnimal
 * @param item
 * @param form
 */
function persistAnimal(idAnimal, item, form) {

    const formData = new FormData();
    // récupérer les images uploadé avec le composant input file
    const files = document.getElementById('animal-images').files;
    for (let i = 0; i < files.length; i++) {
        formData.append('images[]', files[i]);
    }
    if (idAnimal && idAnimal !== "") { // si l'animal existe deja appeler l'api put
        api.put(`/animaux/${idAnimal}`, item, route)
            .then(data => {
                persistImagesAnimal(formData, data); // stocker les images apres avoir mis à jour l'animal
                fetchAnimaux(); // rafraichir la liste des animaux
                document.getElementById("btn-close-animal-modal").click(); // fermer le modal animal
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    } else { // si l'animal n'existe pas deja en base, appeler l'api post
        api.post(`/animaux/`, item, route)
            .then(data => {
                persistImagesAnimal(formData, data); // stocker les images apres avoir ajouté l'animal
                form.reset(); // renitialiser le formaulire (etat et validation)
                form.classList.remove('was-validated')
                fetchAnimaux(); // rafraichir la liste des animaux
                document.getElementById("btn-close-animal-modal").click(); // fermer le modal animal
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
}