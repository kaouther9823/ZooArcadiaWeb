import {INIT_PAGE, ITEM_PER_PAGE} from "/scripts/common/commun.js";
import {api} from "/scripts/common/api.js";
const controllerUrl = '/consultations';

export function fetchConsultations(page = INIT_PAGE, consultationsPerPage = ITEM_PER_PAGE) {
    api.get(controllerUrl)
        .then(consultations => {
            displayConsultations(consultations, page, consultationsPerPage);
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}


function displayConsultations(consultations, page, consultationPerPage) {
    const totalConsultations = consultations.length;
    const totalPages = Math.ceil(totalConsultations / consultationPerPage);
    const offset = (page - 1) * consultationPerPage;
    const paginatedConsultations = consultations.slice(offset, offset + consultationPerPage);
    let rows = '';
    paginatedConsultations.forEach(consultation => {
        rows += `
                    <tr>
                        <td>${consultation.animalName}</td>
                        <td>${consultation.animalRace}</td>
                        <td>${consultation.animalHabitat}</td>
                        <td>${consultation.count}</td></tr>`;


    });
    document.getElementById('consultationRows').innerHTML = rows;
    renderPagination(totalPages, page);
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
            fetchConsultations(i);
        });
        paginationElement.appendChild(li);
    }
}