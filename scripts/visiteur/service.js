const API_BASE_URL = 'http://127.0.0.1:8000/api';
const api = {
    get: function (url) {
        return fetch(`${API_BASE_URL}${url}`).then(response => response.json());
    },

};

document.addEventListener('DOMContentLoaded', function () {
    if (location.pathname === "/services") {
        console.log("dom content loaded succefully!")
        fetchServicesForVisitor();
    }
});


function fetchServicesForVisitor() {
    api.get('/services')
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
                        <img src="images/${service.imagePath}" class="img-fluid rounded d-block w-100 h-100"
                        alt="${service.nom}">
                        <p class="titre-image image-card">${service.nom}</p>
                    </div>
                `;
                } else {
                    rows += `
                    <div class="col-lg-6 mb-4 image-card text-white pres">
                        <img src="images/${service.imagePath}" class="img-fluid rounded d-block w-100 h-100"
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
