import {
    api
} from '/scripts/common/api.js';
import {formatDate, INIT_PAGE, ITEM_PER_PAGE} from "/scripts/common/commun.js";

const controllerUrl = "/rapports/veterinaires"
export function editRapport(id) {
    api.get(`${controllerUrl}/${id}`)
        .then(rapport => {
            document.getElementById('idRapport').value = rapport.id;
            document.getElementById('animal').value = rapport.animal.id;
            document.getElementById('etat').value = rapport.etat.id;
            document.getElementById('quantite').value = rapport.quantite;
            document.getElementById('commentaire').value = rapport.detail;
            const editModal = new bootstrap.Modal(document.getElementById('addModal'), {
                keyboard: false
            });
            editModal.show();
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}

export function fetchRapports(edit=true, page = INIT_PAGE, rapportsPerPage = ITEM_PER_PAGE) {
    api.get(controllerUrl)
        .then(rapports => {
            displayReports(rapports, edit, page, rapportsPerPage);
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}

function displayReports(rapports, edit, page, rapportPerPage) {
    const totalRapports = rapports.length;
    const totalPages = Math.ceil(totalRapports / rapportPerPage);
    const offset = (page - 1) * rapportPerPage;
    const paginatedRapports = rapports.slice(offset, offset + rapportPerPage);
    let rows = '';
    paginatedRapports.forEach(rapport => {
        rows += `
                    <tr>
                        <td>${rapport.veterinaire.prenom} ${rapport.veterinaire.nom}</td>
                        <td>${rapport.animal.prenom}</td>
                        <td>${rapport.animal.race.label}</td>
                        <td>${rapport.etat.label}</td>
                        <td>${rapport.nouriture.label}</td>
                        <td>${rapport.quantite}</td>
                        <td>${formatDate(rapport.date)}</td>`;
        if (edit) {
            rows += `          <td>
                            <div class="btn-group" role="group" aria-label="Actions" >
                                <button class="btn btn-primary btn-floating  me-2" aria-label="Modifier" onclick="editRapport(${rapport.id})" data-mdb-ripple-init>
                                      <i class="fa-solid fa-pencil"></i>
                                </button>
                                <button class="btn btn-danger btn-floating" aria-label="Supprimer" onclick="deleteRapport(${rapport.id})" data-mdb-ripple-init>
                                      <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </td>
                    </tr>`;
        } else {  rows += `          <td>
                            <div class="btn-group" role="group" aria-label="Actions" >
                                <button class="btn btn-primary btn-floating  me-2" aria-label="Modifier" onclick="editRapport(${rapport.id})" data-mdb-ripple-init>
                                      <i class="fa-solid fa-eye"></i>
                                </button>
  
                            </div>
                        </td>
                    </tr>`;}

    });
    document.getElementById('rapportRows').innerHTML = rows;
    renderPagination(edit, totalPages, page);
}

export function deleteRapport(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) {
        api.delete(`${controllerUrl}/${id}`)
            .then(() => {
                fetchRapports();
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
}

export function addRapport() {

    event.preventDefault(); // Empêche la soumission par défaut

    const form = document.getElementById('rapportForm');
    if (form.checkValidity() === false) {
        event.stopPropagation();
    } else {
    const idRapportInput = document.getElementById("idRapport");
    const animal = document.getElementById("animal");
    const etat = document.getElementById("etat");
    const nouriture = document.getElementById("nouriture");
    const quantite = document.getElementById("quantite");
    const commentaire = document.getElementById("commentaire");

    const item = {
        animal: animal.value.trim(),
        etat: etat.value.trim(),
        nouriture: nouriture.value.trim(),
        quantite: Number(quantite.value),
        commentaire: commentaire.value.trim(),
    };
    const idRapport = idRapportInput.value.trim();
    if (idRapport && idRapport !== "") {
        api.put(`${controllerUrl}/${idRapport}`, item)
            .then(() => {
                fetchRapports();
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
                fetchRapports();
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    console.log("Rapport ajouté !");
    document.getElementById("btn-close").click();
}
form.classList.add('was-validated');
}

// Fonction pour filtrer les comptes rendus
export function filterReports() {
    const animalFilter = document.getElementById('animalFilter').value;
    const startDateFilter = document.getElementById('startDateFilter').value;
    const endDateFilter = document.getElementById('endDateFilter').value;
    const data= {
        animal: animalFilter? animalFilter.trim() : "",
        startDate: startDateFilter,
        endDate: endDateFilter
    };

    api.get(`${controllerUrl}/search?` + new URLSearchParams(data))
        .then(rapports => {
            displayReports(rapports, false, INIT_PAGE, ITEM_PER_PAGE);
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
            fetchRapports(edit, i);
        });
        paginationElement.appendChild(li);
    }
}
