import {api} from "/scripts/common/api.js";

export function editHorraire(event) {

    const cell = event.currentTarget;
    if (!cell.querySelector('input')) {
        const currentValue = cell.textContent;
        const input = document.createElement('input');
        input.type = 'time';
        input.value = currentValue;
        input.classList.add('w-100', 'form-control');
        cell.textContent = '';
        cell.appendChild(input);

        input.addEventListener('blur', function () {
            cell.textContent = input.value;
        });

        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                cell.textContent = input.value;
            }
        });

        input.focus();
    }

}

export function saveHorraires() {
    const rows = document.querySelectorAll('#horrairesRows tr');
    const scheduleData = [];

    rows.forEach(row => {
        const day = row.children[0].textContent;
        const openingTime = row.children[1].textContent;
        const closingTime = row.children[2].textContent;
        scheduleData.push({day, openingTime, closingTime});
    });
    api.post('/horraires', scheduleData)
        .then(response => console.log(response))
        .catch(error => console.error('There was an error!', error));

}

export function fetchHorraires() {
    let rows ="";
    api.get('/horraires/')
    .then(horraires => {

        horraires.forEach(horraire => {
                rows += `
                    <tr>
                        <td>${horraire.jour}</td>
                        <td class="editable text-center" onclick="editHorraire(event)">${horraire.heureOuverture}</td>
                        <td class="editable text-center" onclick="editHorraire(event)">${horraire.heureFermeture}</td>
                    </tr>
                `;
            });
            document.getElementById('horrairesRows').innerHTML = rows;
    })
}