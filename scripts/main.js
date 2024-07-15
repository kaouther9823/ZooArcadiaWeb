import {fetchAnimaux,deleteAnimal,updateAnimal,editAnimal, addAnimal} from "/scripts/entities/animal.js";
import {
    showHabitat,
    fetchHabitats,
    updateHabitat,
    deleteHabitat,
    addHabitat,
    editHabitat
} from "/scripts/entities/habitat.js";
import {fetchServices, addService, editService, deleteService, updateService} from "/scripts/entities/service.js";
import {fetchHabitatsForVisitor} from "/scripts/visiteur/habitat.js";
import {fetchServicesForVisitor} from "/scripts/visiteur/service.js";
import {rate} from "/scripts/entities/avis.js";
import {fetchEtat,fetchRaces, fetchAllAnimaux, fetchNouriture} from "/scripts/common/commun.js"
import {fetchRapports, addRapport, editRapport, deleteRapport, filterReports} from "/scripts/entities/rapport.js";
import {fetchAvis, saveAvis, updateAvis} from "/scripts/entities/avis.js"
import {fetchUsers, addUser, deleteUser, editUser, showInputsPasswd} from "/scripts/entities/user.js";
import {editHorraire}   from "/scripts/entities/horraire.js";

document.addEventListener('DOMContentLoaded', function () {
    let trouve = true;
    switch (location.pathname) {
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
        case '/employe/avis':
            fetchAvis();
            break;
        case '/admin/users':
            fetchUsers();
            break;
        case '/admin/animaux':
            fetchAnimaux();
            break;
        case '/admin/horraires':
            editHorraire();
            break;
        case '/veterinaire/rapports':
            fetchRapports(false);
            break;
        case '/admin/rapports':
            fetchRapports();
            fetchEtat('etat');
            fetchNouriture('nouriture')
            fetchAllAnimaux('animal');
            break;
        default:
            trouve = false;
    }

    if (trouve === false ) {
        if (location.pathname.includes("/admin/habitat/")){
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
window.addService= addService;
window.editService = editService;
window.updateService = updateService;
window.deleteService = deleteService;
window.rate = rate;
window.fetchAvis = fetchAvis;
window.saveAvis = saveAvis;
window.updateAvis = updateAvis;
window.addUser = addUser;
window.deleteUser = deleteUser;
window.editHorraire = editHorraire;
window.filterReports = filterReports;
window.editUser = editUser;
window.showInputsPasswd = showInputsPasswd;

export function resetForm() {
    const form = document.getElementsByClassName('needs-validation')[0];
    form.reset();
    form.classList.remove('was-validated')
}
window.resetForm = resetForm;
//window.fetchServices = fetchServices;