import {addAnimal, addAnimalInHabitatView, deleteAnimal, editAnimal, fetchAnimaux} from "/scripts/entities/animal.js";
import {addHabitat, deleteHabitat, editHabitat, fetchHabitats, showHabitat} from "/scripts/entities/habitat.js";
import {addService, deleteService, editService, fetchServices} from "/scripts/entities/service.js";
import {fetchHabitatsForVisitor, redirectToDetailsHabitat} from "/scripts/visiteur/habitat.js";
import {fetchServicesForVisitor} from "/scripts/visiteur/service.js";
import {fetchAnnimauxForVisitor, showAnimalImages, redirectToDetailsAnimal, showDetailsAnimal} from "/scripts/visiteur/animal.js";
import {fetchAllAnimaux, fetchEtat, fetchNouriture, fetchRaces, fetchListHabitats, initLabelAddModal} from "/scripts/common/commun.js"
import {addRapport, deleteRapport, editRapport, fetchRapports, filterReports} from "/scripts/entities/rapport.js";
import {addCommentaire, deleteCommentaire, editCommentaire, fetchCommentaires} from "/scripts/entities/commentaireVeterinaire.js";
import {displayReview, fetchAvis, hideMessage, saveAvis, updateAvis} from "/scripts/entities/avis.js"
import {addUser, deleteUser, editUser, fetchUsers, showInputsPasswd} from "/scripts/entities/user.js";
import {editHorraire, saveHorraires, fetchHorraires, fetchHorrairesFooter} from "/scripts/entities/horraire.js";
import {
    addRapportEmploye,
    deleteRapportEmploye,
    editRapportEmploye,
    fetchRapportsEmploye,
    filterReportsEmployes
} from "/scripts/entities/rapportEmploye.js";
import {login, logout, showAndHideElementsForRoles, loadUserInfos} from "/scripts/login.js";
import {sendDemandeContact} from "/scripts//visiteur/contact.js";
import {fetchConsultations} from "/scripts/entities/consultation.js"

document.addEventListener('DOMContentLoaded', function () {
    showAndHideElementsForRoles();
    fetchHorrairesFooter();
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
        case '/contact':
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
        case '/employe/avis':
            fetchAvis();
            break;
        case '/veterinaire/commentaires':
            fetchListHabitats('habitat')
            fetchCommentaires();
            break;
        case '/veterinaire/rapportsAlimentation':
            fetchRapportsEmploye(false);
            fetchNouriture('nouriture')
            fetchAllAnimaux('animal');
            break;
        case '/profil':
            loadUserInfos();
            break;
        case '/admin/consultations':
            fetchConsultations();
            break;
        default:
            trouve = false;
    }

    if (trouve === false) {
        const urlArray = location.pathname.split("/");
        const lastElement = urlArray[urlArray.length - 1];
        if (!isNaN(lastElement) && lastElement !== "") {
        if (location.pathname.includes("/habitat/")) {
                if (location.pathname.includes("/admin/habitat/")) {
                    showHabitat(lastElement)
                    fetchAnimaux(lastElement);
                    fetchEtat('animal-etat');
                    fetchRaces('animal-race');
                } else {
                    showHabitat(lastElement);
                    fetchAnnimauxForVisitor(lastElement);
                }
            }
        }
        if (location.pathname.includes("/animal/")) {
            showDetailsAnimal(lastElement);
            showAnimalImages(lastElement);
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
window.deleteRapportEmploye = deleteRapportEmploye;
window.addCommentaire = addCommentaire;
window.editCommentaire = editCommentaire;
window.deleteCommentaire = deleteCommentaire;
window.filterReportsEmployes = filterReportsEmployes;
window.showAndHideElementsForRoles = showAndHideElementsForRoles;
window.login = login;
window.logout = logout;
window.loadUserInfos = loadUserInfos;
window.redirectToDetailsHabitat = redirectToDetailsHabitat;
window.redirectToDetailsAnimal = redirectToDetailsAnimal;
window.sendDemandeContact = sendDemandeContact;

export function resetForm(idForm = null) {

    let form = document.getElementsByClassName('needs-validation')[0];
    if (idForm !== null && idForm !== undefined) {
        form = document.getElementById(idForm);
    }
    form.reset();
    form.classList.remove('was-validated')
}
window.resetForm = resetForm;