import {api, headers, SERVEUR_URL} from "/scripts/common/api.js"

export function fetchServicesForVisitor() {
   api.get('/services/images/list')
        .then(services => {
            let rows = '';
            let index = 0;
            services.forEach(service => {
                index++;
                if (index % 2 !== 0) {
                    rows += `
                    <div class="col-lg-6 mb-4 pres">
                        <h4>${service.nom}</h4>
                        <p>${service.description}</p>
                    </div>
                    <div class="col-lg-6 mb-4 image-card text-white pres">
                         <img src ="data:image/jpeg;base64,${service.imageData}" class="img-fluid rounded d-block w-100 h-100"
                        alt="${service.nom}">
                        <p class="titre-image image-card">${service.nom}</p>
                    </div>
                `;
                } else {
                    rows += `
                    <div class="col-lg-6 mb-4 image-card text-white pres">
                        <img src ="data:image/jpeg;base64,${service.imageData}"  class="img-fluid rounded d-block w-100 h-100"
                        alt="${service.nom}">
                        <p class="titre-image image-card">${service.nom}</p>
                    </div>
                    <div class="col-lg-6 mb-4 pres">
                        <h4>${service.nom}</h4>
                        <p>${service.description}</p>
                    </div>
                `;
                }
            });
            document.getElementById('listServices').innerHTML = rows;
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}
