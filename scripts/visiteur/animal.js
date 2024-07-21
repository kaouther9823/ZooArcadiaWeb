import {api} from "/scripts/common/api.js";
import {listImagesByAnimal, getImageById} from "/scripts/entities/animal.js";

export function fetchAnnimauxForVisitor(idHabitat) {
    api.get(`/animaux/habitat/${idHabitat}`)
        .then(animaux => {
            let index = 0;
            let rows = '';
            animaux.forEach(animal => {
                listImagesByAnimal(animal.id).then(data => {
                    if (data && data.length > 0) {
                        const imageId = data[data.length-1].imageId;
                        getImageById(imageId).then(image => {
                            rows += `
                                <div class="col p-3" onclick="redirectToDetailsAnimal(${animal})">`;
                            if (index % 3 === 0) {
                                rows += '<div class="image-card-col1 text-white">';
                            } else if (index % 3 === 1) {
                                rows += '<div class="image-card-col2 text-white">';
                            } else {
                                rows += '<div class="image-card-col3 text-white">';
                            }
                            rows += `<img src="data:image/jpeg;base64,${image.base64Data}"  class="rounded gallery-image"/>
                                        <div class="overlay"></div>
                                        <p class="titre-image">${animal.prenom}</p>     
                                    </div>
                                </div>`;
                            document.getElementById('listAnimaux').innerHTML = rows;
                            index++;
                        }).catch(error => {
                            console.error('There was an error!', error);
                        });
                    }
                })
            });
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}

export function showAnimalImages(id) {
    listImagesByAnimal(id).then(data => {
        if (data && data.length > 0) {
            let rows = "";
            let index = 0;
            data.forEach(image => {
                rows += `
                      <div class="col p-3">`;
                if (index % 2 === 0) {
                    rows += '<div class="image-card-col1 text-white">';
                } else  {
                    rows += '<div class="image-card-col3 text-white">';
                }
                rows += `<img src="data:image/jpeg;base64,${image.base64Data}" class="rounded gallery-image"/>
                                        <div class="overlay"></div>   
                                    </div>
                                </div>`;
                document.getElementById('listImages').innerHTML = rows;
                index++;
            }).catch(error => {
                console.error('There was an error!', error);
            });
        }
    })
}

export function redirectToDetailsAnimal(animal) {
    incrementConsultation(animal)
    window.location.href='/animal/'+animal.id;
}

export function showDetailsAnimal(id) {
    api.get(`/animaux/${id}`)
        .then(animal => {
            document.getElementById('animal-id').value = animal.id;
            document.getElementById('animal-prenom').value = animal.prenom;
            document.getElementById('animal-etat').value = animal.etat.label;
            document.getElementById('animal-race').value = animal.race.label;
            document.getElementById('animal-habitat').value = animal.habitat.nom;
            document.getElementById('nomAnimal').innerHTML = animal.prenom;
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}

function incrementConsultation(animal) {
    const animalName = animal.getAttribute('data-animal-name');

    api.put('/consultations', animal)
        .then(data => {
            console.log(data.message);
        })
        .catch(error => console.error('Error:', error));
}