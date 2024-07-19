import {API_BASE_URL} from "/scripts/common/api.js";

export const ITEM_PER_PAGE = 5;
export const INIT_PAGE = 1;

export function fetchEtat(idSelect) {
    fetch(`${API_BASE_URL}/etats`)  // Assurez-vous que l'URL de l'API est correcte
        .then(response => response.json())
        .then(data => {
            const etatSelect = document.getElementById(idSelect);
            etatSelect.innerHTML = ''; // Clear the select element
            data.forEach(etat => {
                const option = document.createElement('option');
                option.value = etat.id;
                option.textContent = etat.label;
                etatSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des etats:', error);
            const etatSelect = document.getElementById(idSelect);
            etatSelect.innerHTML = '<option value="">Erreur de chargement</option>';
        });
}


export function fetchRaces(idSelect) {
    fetch(`${API_BASE_URL}/races`)  // Assurez-vous que l'URL de l'API est correcte
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById(idSelect);
            select.innerHTML = ''; // Clear the select element
            data.forEach(race => {
                const option = document.createElement('option');
                option.value = race.id;
                option.textContent = race.label;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des races:', error);
            const select = document.getElementById(idSelect);
            select.innerHTML = '<option value="">Erreur de chargement</option>';
        });
}

export function fetchNouriture(idSelect) {
    fetch(`${API_BASE_URL}/nouritures`)  // Assurez-vous que l'URL de l'API est correcte
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById(idSelect);
            select.innerHTML = ''; // Clear the select element
            data.forEach(nouriture => {
                const option = document.createElement('option');
                option.value = nouriture.id;
                option.textContent = nouriture.label;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des races:', error);
            const select = document.getElementById(idSelect);
            select.innerHTML = '<option value="">Erreur de chargement</option>';
        });
}

export function fetchListHabitats(idSelect) {
    fetch(`${API_BASE_URL}/habitats`)  // Assurez-vous que l'URL de l'API est correcte
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById(idSelect);
            select.innerHTML = ''; // Clear the select element
            data.forEach(habitat => {
                const option = document.createElement('option');
                option.value = habitat.id;
                option.textContent = habitat.nom;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des races:', error);
            const select = document.getElementById(idSelect);
            select.innerHTML = '<option value="">Erreur de chargement</option>';
        });
}


export function fetchAllAnimaux(idSelect) {
    fetch(`${API_BASE_URL}/animaux`)  // Assurez-vous que l'URL de l'API est correcte
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById(idSelect);
            select.innerHTML = ''; // Clear the select element
            data.forEach(aimal => {
                const option = document.createElement('option');
                option.value = aimal.id;
                option.textContent = `${aimal.race.label} -${aimal.prenom}`;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des races:', error);
            const select = document.getElementById(idSelect);
            select.innerHTML = '<option value="">Erreur de chargement</option>';
        });
}

export function initLabelAddModal(entite) {
    document.getElementById('addModalLabel').innerText = "Ajouter un " + entite;
}

export function formatDate(date) {
    {
        let result ="";
        if (date) {
            const dateStr = date.substring(0, 10)
            if (dateStr) {
                const elements = dateStr.split('-');
                if (elements.length === 3) {
                    result =  elements[2] + '/' + elements[1] + '/' + elements[0];
                }
            }
        }
        return result;
    }
}