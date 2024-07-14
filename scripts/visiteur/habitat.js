import { api } from "/scripts/common/api.js"

export function fetchHabitatsForVisitor() {
    api.get('/habitats')
        .then(habitats => {
            let rows = '';
            let index = 0;
            habitats.forEach(habitat => {
                    rows += `
                    <div class="col-lg-6 mb-4 pres">
                        <h4>${habitat.nom}</h4>
                    </div>
                    <div class="col-lg-6 mb-4 image-card text-white pres">
                        <img src="" class="img-fluid rounded d-block w-100 h-100"
                        alt="${habitat.nom}">
                        <p class="titre-image image-card">${habitat.nom}</p>
                    </div>
                `;
            });
            document.getElementById('listHabitats').innerHTML = rows;
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}
