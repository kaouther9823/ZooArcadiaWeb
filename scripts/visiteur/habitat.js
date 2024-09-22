import {api} from "/scripts/common/api.js"
import {listImageByHabitat} from "/scripts/entities/habitat.js"

export function fetchHabitatsForVisitor() {
    api.get('/habitats')
        .then(habitats => {
            let rows = '';
            habitats.forEach(habitat => {
                listImageByHabitat(habitat.id).then(data => {
                    if (data && data.length > 0) {
                            rows += `
                                <div class="col-lg-6 mb-4 image-card text-white pres">
                                    <img src="data:image/jpeg;base64,${data[0].base64Data}" onclick="redirectToDetailsHabitat(${habitat.id})"  class="img-fluid rounded d-block w-100 h-100"
                                    alt="${habitat.nom}">
                                    <p class="titre-image image-card">${habitat.nom}</p>
                                </div>`;
                    }
                    document.getElementById('listHabitats').innerHTML = rows;
                }).catch(error => console.error('Error fetching images by habitat:', error));
            });
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}

export function redirectToDetailsHabitat(id) {
    window.location.href='/habitat/'+id;
}