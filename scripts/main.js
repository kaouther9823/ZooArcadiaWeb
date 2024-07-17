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
import {fetchAvis, saveAvis, updateAvis, hideMessage, displayReview} from "/scripts/entities/avis.js"
import {rate} from "/scripts/entities/avis.js";
import {fetchEtat,fetchRaces, fetchAllAnimaux, fetchNouriture} from "/scripts/common/commun.js"
import {fetchRapports, addRapport, editRapport, deleteRapport} from "/scripts/entities/rapport.js";

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
        case '/employe/avis':
            fetchAvis();
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

window.fetchAvis = fetchAvis;
window.saveAvis = saveAvis;
window.updateAvis = updateAvis;

export function resetForm() {
    const form = document.getElementsByClassName('needs-validation')[0];
    form.reset();
    form.classList.remove('was-validated')
}
window.resetForm = resetForm;