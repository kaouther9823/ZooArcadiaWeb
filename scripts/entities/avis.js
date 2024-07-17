import {api} from "/scripts/common/api.js";

export function rate(event) {
    const ratingInput = document.getElementById('evaluation');
    const rating = event.currentTarget.getAttribute('data-value');
    const stars = document.getElementsByClassName('fa fa-star');
    ratingInput.value = rating;
    for (const star of stars) {
        if (star.getAttribute('data-value') <= rating) {
            star.classList.add('star');
        } else {
            star.classList.remove('star');
        }
}
}


export function saveAvis() {
    event.preventDefault(); // Empêche la soumission par défaut

    const form = document.getElementById('ratingForm');
    if (form.checkValidity() === false) {
        event.stopPropagation();
    }
    else {
        const pseudoInput = document.getElementById('pseudo');
        const commentaireInput = document.getElementById('commentaire');
        const radios = document.getElementsByName('evaluation');
        let rating = 0;
        radios.forEach(radio => {
            if (radio.checked) {
                rating = radio.value;
            }
        })
        const avisItem = {
            pseudo: pseudoInput.value,
            note: rating,
            commentaire: commentaireInput.value.trim()
        };
        api.post(`/avis/`, avisItem)
            .then(() => {
                document.getElementById("message").style.display = 'block';
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
    form.classList.add('was-validated');
}

export function fetchAvis(page=1, avisPerPage = 5) {
    api.get('/avis')
        .then(avis => {
            let row = '';
            document.getElementById('avisRows').innerHTML = "";
            const totalAvis = avis.length;
            const totalPages = Math.ceil(totalAvis / avisPerPage);
            const offset = (page - 1) * avisPerPage;
            const paginatedAvis = avis.slice(offset, offset + avisPerPage);
            paginatedAvis.forEach(avis => {
                const treatedMessage = avis.treated? "Traité": "en cour de traitement";
                const statusMessage = avis.visible? "Validé": (avis.treated? "Rejeté" :"");
                row = `
                    <tr>
                        <td>${avis.pseudo}</td>
                        <td>${avis.commentaire}</td>
                        <td>${treatedMessage}</td>
                        <td>
                        <div class="btn-group" role="group" aria-label="Actions">
                            <button name="actions-${avis.avisId}" class="btn btn-primary btn-floating me-2" title="Valider" onclick="updateAvis(${avis.avisId}, true)" data-mdb-ripple-init>
                                  <i class="fa-solid fa-check"></i>
                            </button>
                            <button name="actions-${avis.avisId}" class="btn btn-danger btn-floating" title="Rejeter" onclick="updateAvis(${avis.avisId}, false)" data-mdb-ripple-init>
                                  <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <span id="status-${avis.avisId}">${statusMessage}</span>
                        </td>
                    </tr>
                `;
                document.getElementById('avisRows').innerHTML += row;
                const btns = document.getElementsByName('actions-'+avis.avisId);
                if (avis.treated){
                    btns.forEach(btn => {
                        btn.classList.remove('d-block');
                        btn.classList.add('d-none');
                    });
                    document.getElementById('status-'+avis.avisId).classList.remove('d-none');
                   // document.getElementById('status-'+avis.avisId).classList.add('d-block');
                } else {
                    btns.forEach(btn => {
                        btn.classList.remove('d-none');
                        btn.classList.add('d-block');
                    });
                    document.getElementById('status-'+avis.avisId).classList.remove('d-block');
                   //document.getElementById('status-'+avis.avisId).classList.add('d-none');
                }
                renderPagination(totalPages, page);
            });


        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}

export function updateAvis(idAvis, isValid) {
    const avisItem = {
        treated : true,
        visible: !!isValid
    }
    api.put(`/avis/${idAvis}`, avisItem)
        .then(() => {
            fetchAvis();
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}

export function hideMessage() {
    setTimeout(() => {
        document.getElementById("message").style.display = 'none';}, 100);
    }
function renderPagination(totalPages, currentPage) {
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.classList.add('page-item');
        if (i === currentPage) {
            li.classList.add('active');
        }
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener('click', (event) => {
            event.preventDefault();
            fetchAvis(i);
        });
        paginationElement.appendChild(li);
    }
}
export function displayReview(){
    setTimeout(() => {
    let  rows ="";
    //document.getElementById('visitors-reviews"').innerHTML = "";
    api.get('/avis/home')
        .then(reviews => {
            reviews.forEach(review => {
                let rating = `<div class="rating">`;
                for (let i = 0; i < review.note ; i++) {
                    rating += `<span class="star">&#9733;</span>`;
                }
                for (let i = 0; i < ( 5 - review.note) ; i++) {
                    rating += `<span class="star">&#9734;</span>`;
                }
                rating += `</div>`;
                rows += `
                    <div class = "col" >
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title">${review.pseudo}</h5>
                                <p class="card-text">"${review.commentaire}"</p>`;
                                rows += rating;
                    rows += `</div>
                        </div>
                    </div>
                `;
                document.getElementById('visitors-reviews').innerHTML += rows;
            });
        })
        .catch(error => {
            console.error('There was an error!', error);
        });}, 100);
}
