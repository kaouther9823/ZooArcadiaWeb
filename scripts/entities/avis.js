/*export function updateStars() {
    const stars = document.querySelectorAll('.star-rating .fa-star');
    const ratingInput = document.getElementById('evaluation');

    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-value');
            ratingInput.value = rating;
            stars.forEach(s => {
                if (s.getAttribute('data-value') <= rating) {
                    s.classList.add('selected');
                } else {
                    s.classList.remove('selected');
                }
            });
        });
    });
}*/
import {api}  from "/scripts/common/api.js";

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
        const ratingForm = document.getElementById('ratingForm');
        const pseudoInput = document.getElementById('pseudo');
        const commentaireInput = document.getElementById('commentaire');
        const rating = ratingForm.elements['rating'].value;
        const avisItem = {
            pseudo: pseudoInput.value,
            note: rating,
            commentaire: commentaireInput.value.trim()
        };
        api.post(`/avis/`, avisItem)
            .then(() => {
                reponseInput.innerText = "Votre avis a été soumis avec success, il sera validé par nos employé. "
            })
            .catch(error => {
                console.error('There was an error!', error);
            });

}

export function fetchAvis() {
    api.get('/avis')
        .then(services => {
            let rows = '';
            services.forEach(avis => {
                const treated = avis.isTreated? "Traité": "non traité";
                rows += `
                    <tr>
                        <td>${avis.pseudo}</td>
                        <td>${avis.commentaire}</td>
                        <td>${treated}</td>
                        <td>
                        <div class="btn-group" role="group" aria-label="Actions">
                            <button class="btn btn-primary btn-floating  me-2" aria-label="Valider" onclick="updateAvis(${avis.avisId}, true)" data-mdb-ripple-init>
                                  <i class="fa-solid fa-check"></i>
                            </button>
                            <button class="btn btn-danger btn-floating" aria-label="Rejeter" onclick="updateAvis(${avis.avisId}, false)" data-mdb-ripple-init>
                                  <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                        </td>
                    </tr>
                `;
            });
            document.getElementById('avisRows').innerHTML = rows;
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
        .then(() => {})
        .catch(error => {
            console.error('There was an error!', error);
        });
}