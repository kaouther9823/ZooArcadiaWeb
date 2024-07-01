import Route from "./Route.js"

export const  allRoutes= [
    new Route("/", "Accueil", "pages/home.html"),
    new Route("/animals", "Animaux", "pages/animals.html"),
]

export const websiteName = "Zoo Arcadia";