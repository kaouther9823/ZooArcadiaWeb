export function editHorraire(event) {

    const cell = event.currentTarget;
            if (!cell.querySelector('input')) {
                const currentValue = cell.textContent;
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentValue;
                input.width= '50px';
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
    const rows = document.querySelectorAll('#horraireRows tr');
    const scheduleData = [];

    rows.forEach(row => {
        const day = row.children[0].textContent;
        const openingTime = row.children[1].textContent;
        const closingTime = row.children[2].textContent;
        scheduleData.push({day, openingTime, closingTime});
    });
}