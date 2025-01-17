import Route from "./Route.js";
import {allRoutes, websiteName} from "./allRoutes.js";
import {getRole, isConnected} from "/scripts/login.js";

// Création d'une route pour la page 404 (page introuvable)
const route404 = new Route("/404", "Page introuvable", "/pages/404.html");
const route403 = new Route("/403", "Page inaccessible", "/pages/403.html");

// Fonction pour récupérer la route correspondant à une URL donnée
const getRouteByUrl = (url) => {
    let currentRoute = null;
    let isForm = false;
    let urlRoute = url;
    // Parcours de toutes les routes pour trouver la correspondance
    const urlArray = url.split("/");
    const lastElement = urlArray[urlArray.length - 1];
    if (!isNaN(lastElement) && lastElement !== "") {
        urlRoute = url.replace(lastElement, "${id}");
        isForm = true
    }
    allRoutes.forEach((element) => {
        if (element.url === urlRoute) {
            currentRoute = element;
            if (isForm) {
                currentRoute.url = url;
            }
        }
    });
    const role = getRole();

    // Si aucune correspondance n'est trouvée, on retourne la route 404
    if (currentRoute != null) {
        const roles = currentRoute.roles;
        if (!roles || roles.length === 0) {
            return currentRoute;
        } else {
            if (roles.includes(role)){
                return currentRoute;
            } else {
                return route403;
            }
        }
    } else {
        return route404;
    }
};

// Fonction pour charger le contenu de la page
const LoadContentPage = async () => {
    const path = window.location.pathname;
    // Récupération de l'URL actuelle
    const actualRoute = getRouteByUrl(path);
    // Récupération du contenu HTML de la route
    // Ajout du contenu HTML à l'élément avec l'ID "main-page"
    document.getElementById("main-page").innerHTML = await fetch(actualRoute.pathHtml).then((data) => data.text());

    if (actualRoute.url.includes("/admin/")) {
        document.getElementById("carousel").style.display = "none";
        document.getElementById("zooFooter").style.display = "none";
    } else {
        document.getElementById("carousel").style.display = "block";
        document.getElementById("zooFooter").style.display = "block";
    }

    // Ajout du contenu JavaScript
/*    if (actualRoute.pathJS !== []) {
        // Création d'une balise script
        actualRoute.pathJS.forEach(pathScript => {
            let scriptTag = document.createElement("script");
            scriptTag.setAttribute("type", "text/javascript");
            scriptTag.setAttribute("src", pathScript);
            document.querySelector("body").appendChild(scriptTag);
        })
        // Ajout de la balise script au corps du document

    }*/

    // Changement du titre de la page
    document.title = actualRoute.title + " - " + websiteName;
};

// Fonction pour gérer les événements de routage (clic sur les liens)
const routeEvent = (event) => {
    event = event || window.event;
    event.preventDefault();
    // Mise à jour de l'URL dans l'historique du navigateur
    window.history.pushState({}, "", event.target.href);
    // Chargement du contenu de la nouvelle page
    LoadContentPage();
};

// Gestion de l'événement de retour en arrière dans l'historique du navigateur
window.onpopstate = LoadContentPage;
// Assignation de la fonction routeEvent à la propriété route de la fenêtre
window.route = routeEvent;
// Chargement du contenu de la page au chargement initial
LoadContentPage();