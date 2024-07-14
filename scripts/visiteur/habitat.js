import { api } from "/scripts/common/api.js"
import {listImageByHabitat} from "/scripts/entities/habitat.js"

export function fetchHabitatsForVisitor() {
    api.get('/habitats')
        .then(habitats => {
            let rows = '';
            let images ='';
            let index = 0;
            habitats.forEach(habitat => {

                listImageByHabitat(habitat.id).then(data => {
                    if (data && data.length > 0) {
                        data.forEach(image => {
                            images += `
                                <div class="col-lg-6 mb-4 image-card text-white pres">
                                    <img src="data:image/jpeg;base64,${image.base64Data}" class="img-fluid rounded d-block w-100 h-100"
                                    alt="${habitat.nom}${image.imageId}">
                                    <p class="titre-image image-card">${habitat.nom}${image.imageId}</p>
                                </div>
                            `;
                        });
                    }
                    rows += `
                    <div class="col-lg-6 mb-4 pres">
                        <h4>${habitat.nom}</h4>
                    </div>
                `+ images;
                    document.getElementById('listHabitats').innerHTML = rows;
                }).catch(error => console.error('Error fetching images by habitat:', error));
            });
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}
