import {api} from "/scripts/common/api.js";

export function sendDemandeContact() {
    event.preventDefault(); // Empêche la soumission par défaut

    const form = document.getElementById('contactForm');
    if (form.checkValidity() === false) {
        event.stopPropagation();
    } else {
        const nameInput = document.getElementById('inputName');
        const emailInput = document.getElementById('inputEmail');
        const messageInput = document.getElementById('inputMessage');

        const contactItem = {
            nom: nameInput.value.trim(),
            email: emailInput.value.trim(),
            message: messageInput.value.trim()
        };
        api.post(`/contact/`, contactItem)
            .then(() => {
                document.getElementById("message").style.display = 'block';
                document.getElementById("sendBtn").disabled = true;
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
    form.classList.add('was-validated');
}