let API_BASE_URL = "http://localhost:8001/api";
const api = {
    get: function (url) {
        return fetch(`${API_BASE_URL}${url}`).then(response => response.json());
    },
    post: function (url, data) {
        return fetch(`${API_BASE_URL}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json());
    },
    put: function (url, data) {
        return fetch(`${API_BASE_URL}${url}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json());
    },
    delete: function (url) {
        return fetch(`${API_BASE_URL}${url}`, {
            method: 'DELETE'
        }).then();
    },
    uploadImages: function (url, formData) {
        console.log(formData);
        return     fetch(`${API_BASE_URL}${url}`, {
            method: 'POST',
            body: formData
        })
            .then(data => {
                data.json();
                document.getElementById('uploadResult').innerHTML = `<div class="alert alert-success">Images uploaded successfully!</div>`;
            })
            .catch(error => {
                document.getElementById('uploadResult').innerHTML = `<div class="alert alert-danger">Error uploading images.</div>`;
                console.error('Error:', error);
            });
    }

};

export function fetchEtat() {
    fetch(`${API_BASE_URL}/etats`)  // Assurez-vous que l'URL de l'API est correcte
        .then(response => response.json())
        .then(data => {
            const etatSelect = document.getElementById('animal-etat');
            etatSelect.innerHTML = ''; // Clear the select element
            data.forEach(etat => {
                const option = document.createElement('option');
                option.value = etat.etatId;
                option.textContent = etat.label;
                etatSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des etats:', error);
            const etatSelect = document.getElementById('animal-etat');
            etatSelect.innerHTML = '<option value="">Erreur de chargement</option>';
        });
}


export function fetchRaces() {
    fetch(`${API_BASE_URL}/races`)  // Assurez-vous que l'URL de l'API est correcte
        .then(response => response.json())
        .then(data => {
            const raceSelect = document.getElementById('animal-race');
            raceSelect.innerHTML = ''; // Clear the select element
            data.forEach(race => {
                const option = document.createElement('option');
                option.value = race.raceId;
                option.textContent = race.label;
                raceSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des races:', error);
            const raceSelect = document.getElementById('animal-race');
            raceSelect.innerHTML = '<option value="">Erreur de chargement</option>';
        });
}

export function editAnimal(id) {
    api.get(`/animaux/${id}`)
        .then(animal => {
            document.getElementById('animal-id').value = animal.id;
            document.getElementById('animal-prenom').value = animal.prenom;
            document.getElementById('animal-etat').value = animal.etat.etatId;
            document.getElementById('animal-race').value = animal.race.raceId;
            var animalModal = new bootstrap.Modal(document.getElementById('animalModal'), {
                keyboard: false
            });
            animalModal.show();
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}

export function fetchAnimaux(habitatId) {
    const urlArray = location.pathname.split("/");
    const idHabitat = urlArray[urlArray.length - 1];
    if (!isNaN(idHabitat) && idHabitat !== "") {
        fetch(`${API_BASE_URL}/animaux/habitat/${idHabitat}`).then(response => response.json())
            .then(animaux => {
                let rows = '';
                animaux.forEach(animal => {
                    rows += `
                    <tr>
                        <td>${animal.prenom}</td>
                        <td>${animal.race.label}</td>
                        <td>${animal.etat.label}</td>
                        <td><img id="animal-${animal.id}-1" alt="" height=100 width=100 />
                        <td>
                        <div class="btn-group" role="group" aria-label="Actions">
                            <button class="btn btn-primary btn-floating  me-2" aria-label="Modifier" onclick="editAnimal(${animal.id})" data-mdb-ripple-init>
                                  <i class="fa-solid fa-pencil"></i>
                            </button>
                            <button class="btn btn-danger btn-floating" aria-label="Supprimer" onclick="deleteAnimal(${animal.id})" data-mdb-ripple-init>
                                  <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                        </td>
                    </tr>`;
                    document.getElementById('animalTable').innerHTML = rows;
                    listImagesByAnimal(animal.id).then(data => {
                        if (data && data.length > 0) {
                            const imageId = data[0].imageId;
                            getImageById(imageId).then(image => {
                                const idImageComponent = 'animal-' + image.animalId + '-1';
                                const imgElement = document.getElementById(idImageComponent);
                                imgElement.src = 'data:image/jpeg;base64,' + image.base64Data;
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
}
export function deleteAnimal(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet animal ?')) {
        api.delete(`/animaux/${id}`)
            .then(data => {
                fetchAnimaux();
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
}

export function updateAnimal() {
    const idInputText = document.getElementById("edit-id");
    const nameInputText = document.getElementById("edit-prenom");
    const etatInputText = document.getElementById("edit-etat");
    // upload images
    const formData = new FormData();
    const files = document.getElementById('edit-images').files;
    formData.append('image', files[0]);
    formData.append('imageName', files[0].name);
    const item = {
        id: idInputText.value,
        prenom: nameInputText.value.trim(),
        etat: etatInputText.value.trim(),
    };
    fetch(`${API_BASE_URL}/images/upload`, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('uploadResult').innerHTML = `<div class="alert alert-success">Images uploaded successfully!</div>`;
            const item = {
                prenom: nameInputText.value.trim(),
                etat: etatInputText.value.trim(),
            };
            api.put(`/animaux/${idInputText.value}`, item)
                .then(data => {
                    fetchAnimaux();
                    document.getElementById("btn-close").click();
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        })
        .catch(error => {
            document.getElementById('uploadResult').innerHTML = `<div class="alert alert-danger">Error uploading images.</div>`;
            console.error('Error:', error);
        });

}

function deplacerAnimaHabitat(idAnimal, idHabitat) {

}

function listImagesByAnimal(id){
    return api.get(`/animaux/${id}/images`);
}


function getImageById(id){
    return api.get(`/animaux/images/${id}`);

}
export function addAnimal() {
    const urlArray = location.pathname.split("/");
    const idHabitat = urlArray[urlArray.length - 1];
    if (!isNaN(idHabitat) && idHabitat !== "") {
        const name = document.getElementById("animal-prenom");
        const race = document.getElementById("animal-race");
        const idAnimalInput = document.getElementById("animal-id");
        var value = race.options[race.selectedIndex].value;
        var text = race.options[race.selectedIndex].text;

        const etat = document.getElementById("animal-etat");
        var valueEtat = etat.options[etat.selectedIndex].value;
        var textEtat = etat.options[etat.selectedIndex].text;
        // upload images
        const formData = new FormData();
        const files = document.getElementById('animal-images').files;
        for (let i = 0; i < files.length; i++) {
            formData.append('images[]', files[i]);
        }
        const item = {
            prenom: name.value.trim(),
            etatId: etat.value.trim(),
            raceId: race.value.trim(),
            habitatId: idHabitat,
        };
        const idAnimal = idAnimalInput.value.trim();
        if (idAnimal && idAnimal !== "") {
        api.put(`/animaux/${idAnimal}`, item)
           // .then(response => response.json())
            .then(data => {
                if (formData || formData.entries().next().value) {
                    api.uploadImages(`/animaux/${data.id}/upload`, formData)
                        .then(response => console.log(response))
                        .catch(error => {
                            console.error('There was an error!', error);
                        });
                }
                fetchAnimaux();
                document.getElementById("btn-close-animal-modal").click();
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    } else {
            api.post(`/animaux/`, item)
                // .then(response => response.json())
                .then(data => {
                    if (formData.length > 0) {
                        api.uploadImages(`/animaux/${data.id}/upload`, formData)
                            .then(response => console.log(response))
                            .catch(error => {
                                console.error('There was an error!', error);
                            });
                    }
                    fetchAnimaux();
                    document.getElementById("btn-close-animal-modal").click();
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    }
}
//window.addAnimal=addAnimal();