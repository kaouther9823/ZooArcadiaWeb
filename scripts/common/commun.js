import {API_BASE_URL} from "/scripts/common/api.js";

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