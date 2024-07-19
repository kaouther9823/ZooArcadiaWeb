import {
    api
} from '/scripts/common/api.js';
import {formatDate, INIT_PAGE, ITEM_PER_PAGE} from "/scripts/common/commun.js";

const controllerUrl = "/commentaires"
export function editCommentaire(id) {
    api.get(`${controllerUrl}/${id}`)
        .then(commentaire => {
            document.getElementById('addModalLabel').innerText = "Editer un commentaire";
            document.getElementById('id').value = commentaire.avisId;
            document.getElementById('habitat').value = commentaire.habitat.id;
            document.getElementById('commentaire').value = commentaire.commentaire;
            const editModal = new bootstrap.Modal(document.getElementById('addModal'), {
                keyboard: false
            });
            editModal.show();
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}

export function fetchCommentaires(edit=true, page = INIT_PAGE, commentairesPerPage = ITEM_PER_PAGE) {
    api.get(controllerUrl)
        .then(commentaires => {
            displayCommentaires(commentaires, edit, page, commentairesPerPage);
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}

function displayCommentaires(commentaires, edit, page, commentairePerPage) {
    const totalCommentaires = commentaires.length;
    const totalPages = Math.ceil(totalCommentaires / commentairePerPage);
    const offset = (page - 1) * commentairePerPage;
    const paginatedCommentaires = commentaires.slice(offset, offset + commentairePerPage);
    let rows = '';
    paginatedCommentaires.forEach(commentaire => {
        rows += `
                    <tr>
                        <td>${commentaire.veterinaire.prenom} ${commentaire.veterinaire.nom}</td>
                        <td>${commentaire.habitat.nom}</td>
                        <td>${commentaire.commentaire}</td>
                        <td>${formatDate(commentaire.date)}</td>
                        <td>
                            <div class="btn-group" role="group" aria-label="Actions">
                                <button class="btn btn-primary btn-floating  me-2" aria-label="Modifier" onclick="editCommentaire(${commentaire.avisId})" data-mdb-ripple-init>
                                      <i class="fa-solid fa-pencil"></i>
                                </button>
                                <button class="btn btn-danger btn-floating" aria-label="Supprimer" onclick="deleteCommentaire(${commentaire.avisId})" data-mdb-ripple-init>
                                      <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
    });
    document.getElementById('commentairesRows').innerHTML = rows;
    renderPagination(edit, totalPages, page);
}

export function deleteCommentaire(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
        api.delete(`${controllerUrl}/${id}`)
            .then(() => {
                fetchCommentaires();
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
}

export function addCommentaire() {

    event.preventDefault(); // Empêche la soumission par défaut

    const form = document.getElementById('commentaireForm');
    if (form.checkValidity() === false) {
        event.stopPropagation();
    } else {
    const idCommentaireInput = document.getElementById("id");
    const habitat = document.getElementById("habitat");
    const commentaire = document.getElementById("commentaire");

    const item = {
        habitat: habitat.value.trim(),
        commentaire: commentaire.value.trim(),
    };
    const idCommentaire = idCommentaireInput.value.trim();
    if (idCommentaire && idCommentaire !== "") {
        api.put(`${controllerUrl}/${idCommentaire}`, item)
            .then(() => {
                fetchCommentaires();
                document.getElementById("btn-close").click();
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    } else {
        api.post(`${controllerUrl}/`, item)
            .then(() => {
                form.reset();
                form.classList.remove('was-validated')
                fetchCommentaires();
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
    document.getElementById("btn-close").click();
}
form.classList.add('was-validated');
}

// Fonction pour filtrer les comptes rendus
export function filterCommentaires() {
    const animalFilter = document.getElementById('habitatlFilter').value;
    const startDateFilter = document.getElementById('startDateFilter').value;
    const endDateFilter = document.getElementById('endDateFilter').value;
    const data= {
        animal: animalFilter? animalFilter.trim() : "",
        startDate: startDateFilter,
        endDate: endDateFilter
    };

    api.get(`${controllerUrl}/search?` + new URLSearchParams(data))
        .then(commentaires => {
            displayCommentaires(commentaires,false, INIT_PAGE, ITEM_PER_PAGE);
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}

function renderPagination(edit, totalPages, currentPage) {
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
            fetchCommentaires(edit, i);
        });
        paginationElement.appendChild(li);
    }
}