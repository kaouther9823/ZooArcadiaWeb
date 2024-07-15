import {
    api
} from '/scripts/common/api.js';

const controllerUrl = "/rapports/veterinaires"
export function editRapport(id) {
    api.get(`${controllerUrl}/${id}`)
        .then(rapport => {
            document.getElementById('edit-id').value = rapport.id;
            document.getElementById('edit-nom').value = rapport.nom;
            document.getElementById('edit-description').value = rapport.description;
            const editModal = new bootstrap.Modal(document.getElementById('editModal'), {
                keyboard: false
            });
            editModal.show();
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}

export function fetchRapports(edit=true) {
    api.get(controllerUrl)
        .then(rapports => {
            displayReports(rapports, edit);
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}

function displayReports(rapports, edit) {
    let rows = '';
    rapports.forEach(rapport => {
        rows += `
                    <tr>
                        <td>${rapport.veterinaire.prenom} ${rapport.veterinaire.nom}</td>
                        <td>${rapport.animal.prenom}</td>
                        <td>${rapport.animal.race.label}</td>
                        <td>${rapport.etat.label}</td>
                        <td>${rapport.nouriture.label}</td>
                        <td>${rapport.quantite}</td>
                        <td>${rapport.date}</td>
                        <td>
                            <div class="btn-group" role="group" aria-label="Actions" hidden="${!edit}">
                                <button class="btn btn-primary btn-floating  me-2" aria-label="Modifier" onclick="editRapport(${rapport.id})" data-mdb-ripple-init>
                                      <i class="fa-solid fa-pencil"></i>
                                </button>
                                <button class="btn btn-danger btn-floating" aria-label="Supprimer" onclick="deleteRapport(${rapport.id})" data-mdb-ripple-init>
                                      <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
    });
    document.getElementById('rapportRows').innerHTML = rows;
}

export function deleteRapport(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) {
        api.delete(`${controllerUrl}/${id}`)
            .then(data => {
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
    const idRapportInput = document.getElementById("id");
    const animal = document.getElementById("animal");
    const etat = document.getElementById("etat");
    const nouriture = document.getElementById("nouriture");
    const quantite = document.getElementById("quantite");
    const description = document.getElementById("description");

    const item = {
        animal: animal.value.trim(),
        etat: etat.value.trim(),
        nouriture: nouriture.value.trim(),
        quantite: Number(quantite.value),
        description: description.value.trim(),
    };
    const idRapport = idRapportInput.value.trim();
    if (idRapport && idRapport !== "") {
        api.put(`${controllerUrl}/${idRapport}`, item)
            .then(data => {
                fetchRapports();
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
            displayReports(rapports);
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}
