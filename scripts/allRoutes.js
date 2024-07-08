import Route from "./Route.js"

export const  allRoutes= [
    new Route("/", "Accueil", "pages/home.html"),
    new Route("/habitats", "Habitats", "pages/habitats.html", "scripts/entities/habitat.js", "/api/habitats", true),
    new Route("/services", "Services", "pages/services.html", "scripts/entities/service.js", "/api/services", true),
    new Route("/contact", "Contact", "pages/contact.html"),
    new Route("/connexion", "Connexion", "pages/connexion.html"),
]

export const websiteName = "Zoo Arcadia";