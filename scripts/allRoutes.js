import Route from "./Route.js"

export const  allRoutes= [
    new Route("/", "Accueil", "pages/home.html"),
    new Route("/habitats", "Habitats", "pages/habitats.html", ["scripts/visiteur/habitat.js"], "/api/habitats", true),
    new Route("/services", "Services", "pages/services.html", ["scripts/visiteur/service.js"], "/api/services", true),
    new Route("/contact", "Contact", "pages/contact.html"),
    new Route("/connexion", "Connexion", "pages/connexion.html"),
    new Route("/admin/services", "Services", "/pages/admin/services.html", ["/scripts/entities/service.js"], "/api/services", true),
    new Route("/admin/habitats", "Habitats", "/pages/admin/habitats.html", ["/scripts/entities/habitat.js"], "/api/habitats", true),
    new Route("/admin/habitats/animaux", "Animaux", "/pages/admin/animaux.html", ["/scripts/entities/animal.js"], "/api/animaux", true),
    new Route("/admin/habitat/${id}", "Habitat", "/pages/admin/habitat.html", ["/scripts/visiteur/habitat.js", "/scripts/visiteur/habitat.js"], "/api/habitats", true),
    new Route("/veterinaire/rapports", "Rapports", "/pages/veterinaire/rapports.html", ["/scripts/entities/rapport.js"], "/api/rapport/veterinaire", true),
    new Route("/avis", "Avis", "pages/avis.html", ["/scripts/entities/avis.js"], "/api/avis", true),
    new Route("/employe/avis", "Avis", "/pages/employe/avis.html", ["/scripts/entities/avis.js"], "/api/avis", true),
    new Route("/admin/users", "Utilisateurs", "/pages/admin/users.html", ["/scripts/entities/user.js"], "/api/users", true),
    new Route("/admin/consultations", "Consultations des animaux", "/pages/admin/consultations.html", ["/scripts/entities/consultation.js"], "/api/consultations", true),
    new Route("/admin/animaux", "Animaux", "/pages/admin/animaux.html", ["/scripts/entities/animal.js"], "/api/animaux", true),
    new Route("/admin/horraire", "Horraire", "/pages/admin/horraire.html", ["/scripts/entities/horraire.js"], "/api/users", true),
    new Route("/admin/rapports", "Rapports", "/pages/admin/rapports.html", ["/scripts/entities/rapport.js"], "/api/rapport/veterinaire", true),
    new Route("/employe/rapports", "Rapports", "/pages/employe/rapports.html", ["/scripts/entities/rapportEmploye.js"], "/api/rapport/employe", true),
]

export const websiteName = "Zoo Arcadia";