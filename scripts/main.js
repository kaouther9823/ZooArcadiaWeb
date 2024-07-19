import {addAnimal, addAnimalInHabitatView, deleteAnimal, editAnimal, fetchAnimaux} from "/scripts/entities/animal.js";
import {addHabitat, deleteHabitat, editHabitat, fetchHabitats, showHabitat} from "/scripts/entities/habitat.js";
import {addService, deleteService, editService, fetchServices} from "/scripts/entities/service.js";
import {fetchHabitatsForVisitor} from "/scripts/visiteur/habitat.js";
import {fetchServicesForVisitor} from "/scripts/visiteur/service.js";
import {fetchAllAnimaux, fetchEtat, fetchNouriture, fetchRaces, fetchListHabitats, initLabelAddModal} from "/scripts/common/commun.js"
import {addRapport, deleteRapport, editRapport, fetchRapports, filterReports} from "/scripts/entities/rapport.js";

import {displayReview, fetchAvis, hideMessage, saveAvis, updateAvis} from "/scripts/entities/avis.js"
import {addUser, deleteUser, editUser, fetchUsers, showInputsPasswd} from "/scripts/entities/user.js";
import {editHorraire, saveHorraires, fetchHorraires} from "/scripts/entities/horraire.js";
import {
    addRapportEmploye,
    deleteRapportEmploye,
    editRapportEmploye,
    fetchRapportsEmploye
} from "/scripts/entities/rapportEmploye.js";
document.addEventListener('DOMContentLoaded', function () {
    let trouve = true;
    switch (location.pathname) {
        case '/':
            displayReview();
            break;
        case '/services':
            fetchServicesForVisitor();
            break;
        case '/habitats':
            fetchHabitatsForVisitor();
            break;
        case '/admin/services':
            fetchServices();
            break;
        case '/admin/habitats':
            fetchHabitats();
            break;
        case '/avis':
            hideMessage();
            break;

        case '/admin/users':
            fetchUsers();
            break;
        case '/admin/animaux':
            fetchAnimaux();
            setTimeout(() => {
                fetchEtat("animal-etat");
                fetchListHabitats("animal-habitat")
                fetchRaces("animal-race");
            }, 1000);
            break;
        case '/admin/horraire':
            fetchHorraires();
            break;
        case '/veterinaire/rapports':
            fetchRapports(true);
            fetchEtat('etat');
            fetchNouriture('nouriture')
            fetchAllAnimaux('animal');
            break;
        case '/admin/rapports':
            fetchRapports(false);
            fetchEtat('etat');
            fetchNouriture('nouriture')
            fetchAllAnimaux('animal');
            break;
        case '/employe/rapports':
            fetchRapportsEmploye();
            fetchNouriture('nouriture')
            fetchAllAnimaux('animal');
            break;
        default:
            trouve = false;
    }

    if (trouve === false) {
        if (location.pathname.includes("/admin/habitat/")) {
            const urlArray = location.pathname.split("/");
            const lastElement = urlArray[urlArray.length - 1];
            if (!isNaN(lastElement) && lastElement !== "") {
                showHabitat(lastElement)
                fetchAnimaux(lastElement);
                fetchEtat('animal-race');
                fetchRaces('animal-etat');
            }
        }
    }

});

window.addAnimal = addAnimal;
window.editAnimal = editAnimal;
window.deleteAnimal = deleteAnimal;
window.addRapport = addRapport;
window.editRapport = editRapport;
window.deleteRapport = deleteRapport;
window.addHabitat = addHabitat;
window.editHabitat = editHabitat;
window.deleteHabitat = deleteHabitat;
window.addService = addService;
window.editService = editService;
window.deleteService = deleteService;
window.fetchAvis = fetchAvis;
window.saveAvis = saveAvis;
window.updateAvis = updateAvis;
window.addUser = addUser;
window.deleteUser = deleteUser;
window.editHorraire = editHorraire;
window.filterReports = filterReports;
window.editUser = editUser;
window.showInputsPasswd = showInputsPasswd;
window.initLabelAddModal = initLabelAddModal;
window.saveHorraires = saveHorraires;
window.addAnimalInHabitatView= addAnimalInHabitatView;
window.addRapportEmploye = addRapportEmploye;
window.editRapportEmploye = editRapportEmploye;
window.deleteRapport = deleteRapportEmploye;

export function resetForm() {
    const form = document.getElementsByClassName('needs-validation')[0];
    form.reset();
    form.classList.remove('was-validated')
}
window.resetForm = resetForm;