import {api} from '/scripts/common/api.js';
import {formatDate} from "/scripts/common/commun.js";

const controllerUrl = "/rapports/employes"

export function editRapportEmploye(id) {
    api.get(`${controllerUrl}/${id}`)
        .then(rapport => {
            document.getElementById('addModalLabel').innerText = "Editer un rapport";
            document.getElementById("id").value = rapport.id;
            document.getElementById("animal").value = rapport.animal.id;
            document.getElementById("nouriture").value = rapport.nouriture.id;
            document.getElementById("quantite").value = rapport.quantite;
            if (rapport.date) {
                document.getElementById('date').value = rapport.date.substring(0, 10);
            }
            const editModal = new bootstrap.Modal(document.getElementById('addModal'), {
                keyboard: false
            });
            editModal.show();
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}

export function fetchRapportsEmploye(edit = true, page = 1, rapportsPerPage = 5) {
   // if (getRole() !== ROLE_EMPLOYE) {
    //    setTimeout(() => {
    //        document.getElementById('btn-new-div').style.display = 'none'
     //   }, 100);
    //}
    api.get(controllerUrl)
        .then(rapports => {
            displayReports(rapports, edit, page, rapportsPerPage);
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}

function displayReports(rapports, edit, page, rapportPerPage) {
    const totalServices = rapports.length;
    const totalPages = Math.ceil(totalServices / rapportPerPage);
    const offset = (page - 1) * rapportPerPage;
    const paginatedRapports = rapports.slice(offset, offset + rapportPerPage);
    let rows = '';
    paginatedRapports.forEach(rapport => {
        rows += `
                    <tr>
                        <td>${rapport.employe.prenom} ${rapport.employe.nom}</td>
                        <td>${rapport.animal.prenom}</td>
                        <td>${rapport.animal.race.label}</td>
                        <td>${rapport.nouriture.label}</td>
                        <td>${rapport.quantite}</td>
                        <td>${formatDate(rapport.date)}</td>
                        <td>
                            <div class="btn-group" role="group" aria-label="Actions">
                                <button class="btn btn-primary btn-floating  me-2" aria-label="Modifier" title="Modifier" onclick="editRapportEmploye(${rapport.id})" data-mdb-ripple-init>
                                      <i class="fa-solid fa-pencil"></i>
                                </button>
                                <button class="btn btn-danger btn-floating" aria-label="Supprimer" title="Supprimer" onclick="deleteRapport(${rapport.id})" data-mdb-ripple-init>
                                      <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
    });
    document.getElementById('rapportRows').innerHTML = rows;
    renderPagination(edit, totalPages, page);
}

export function deleteRapportEmploye(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) {
        api.delete(`${controllerUrl}/${id}`)
            .then(data => {
                fetchRapportsEmploye();
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
}

export function addRapportEmploye() {

    event.preventDefault(); // Empêche la soumission par défaut

    const form = document.getElementById('rapportForm');
    if (form.checkValidity() === false) {
        event.stopPropagation();
    } else {
        const idRapportInput = document.getElementById("id");
        const animal = document.getElementById("animal");
        const nouriture = document.getElementById("nouriture");
        const quantite = document.getElementById("quantite");
        const date = document.getElementById("date");
        const item = {
            animal: animal.value.trim(),
            nouriture: nouriture.value.trim(),
            quantite: Number(quantite.value),
            date: date.valueAsDate,
        };
        const idRapport = idRapportInput.value.trim();
        if (idRapport && idRapport !== "") {
            api.put(`${controllerUrl}/${idRapport}`, item)
                .then(data => {
                    fetchRapportsEmploye();
                    document.getElementById("btn-close").click();
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        } else {
            api.post(`${controllerUrl}/`, item)
                .then(data => {
                    form.reset();
                    form.classList.remove('was-validated')
                    fetchRapportsEmploye();
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }


        document.getElementById("btn-close").click();
    }
    form.classList.add('was-validated');
    form.reset();
    form.classList.remove('was-validated')
}

// Fonction pour filtrer les comptes rendus
export function filterReportsEmploye() {
    const animalFilter = document.getElementById('animalFilter').value;
    const startDateFilter = document.getElementById('startDateFilter').value;
    const endDateFilter = document.getElementById('endDateFilter').value;
    const data = {
        animal: animalFilter ? animalFilter.trim() : "",
        startDate: startDateFilter,
        endDate: endDateFilter
    };

    api.get(`${controllerUrl}/search?` + new URLSearchParams(data))
        .then(rapports => {
            displayReports(rapports);
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
            fetchRapportsEmploye(edit, i);
        });
        paginationElement.appendChild(li);
    }
}