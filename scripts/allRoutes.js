import Route from "./Route.js"
import {ROLE_ADMIN, ROLE_EMPLOYE, ROLE_VETERINAIRE} from "./common/roles.js"

export const  allRoutes= [
    new Route("/", "Accueil", "pages/home.html"),
    new Route("/habitats", "Habitats", "pages/habitats.html"),
    new Route("/services", "Services", "pages/services.html"),
    new Route("/contact", "Contact", "pages/contact.html"),
    new Route("/connexion", "Connexion", "pages/connexion.html",),
    new Route("/admin/services", "Services", "/pages/admin/services.html", [ROLE_ADMIN, ROLE_EMPLOYE]),
    new Route("/admin/habitats", "Habitats", "/pages/admin/habitats.html", [ROLE_ADMIN]),
    new Route("/admin/habitats/animaux", "Animaux", "/pages/admin/animaux.html", [ROLE_ADMIN]),
    new Route("/admin/habitat/${id}", "Habitat", "/pages/admin/habitat.html", [ROLE_ADMIN]),
    new Route("/veterinaire/rapports", "Rapports", "/pages/veterinaire/rapports.html", [ROLE_VETERINAIRE]),
    new Route("/avis", "Avis", "pages/avis.html",),
    new Route("/employe/avis", "Avis", "/pages/employe/avis.html", [ROLE_EMPLOYE]),
    new Route("/admin/users", "Utilisateurs", "/pages/admin/users.html", [ROLE_ADMIN]),
    new Route("/admin/consultations", "Consultations des animaux", "/pages/admin/consultations.html", [ROLE_ADMIN]),
    new Route("/admin/animaux", "Animaux", "/pages/admin/animaux.html", [ROLE_ADMIN]),
    new Route("/admin/horraire", "Horraire", "/pages/admin/horraire.html", [ROLE_ADMIN]),
    new Route("/admin/rapports", "Rapports", "/pages/admin/rapports.html", [ROLE_ADMIN]),
    new Route("/employe/rapports", "Rapports", "/pages/employe/rapports.html", [ROLE_EMPLOYE]),
    new Route("/veterinaire/commentaires", "Commentaires", "/pages/veterinaire/commentaires.html", [ROLE_ADMIN, ROLE_VETERINAIRE, ROLE_EMPLOYE]),
    new Route("/veterinaire/rapportsAlimentation", "Rapports d'alimentation", "/pages/veterinaire/rapportsAlimentation.html",[ROLE_VETERINAIRE]),
    new Route("/profil", "Profil", "/pages/profil/profil.html", [ROLE_ADMIN, ROLE_VETERINAIRE, ROLE_EMPLOYE]),
    new Route("/habitat/${id}", "Habitat", "/pages/animaux.html"),
    new Route("/animal/${id}", "Animal", "/pages/animal.html"),

]

export const websiteName = "Zoo Arcadia";