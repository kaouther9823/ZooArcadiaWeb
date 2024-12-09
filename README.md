# zooArcadiaWeb
La partie frontend du site zooArcadia.

## Description

Ce projet est un front-end utilisant HTML, CSS (Sass), JavaScript, et Bootstrap. Il permet de créer une interface utilisateur réactive et moderne en utilisant les technologies web populaires. Les dépendances du projet sont gérées via npm.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les logiciels suivants sur votre machine :

- [Node.js](https://nodejs.org/) (version 12 ou plus)
- [npm](https://www.npmjs.com/) (généralement installé avec Node.js)
- [php](https://sourceforge.net/projects/wampserver/)

## Installation

1. Clonez le dépôt sur votre machine locale :

```sh
git clone https://github.com/kaouther9823/ZooArcadiaWeb.git
cd ZooArcadiaWeb
```

2. Installez les dépendances npm :

```sh
   npm install
```
3. Lancez le projet localement

```sh
php -S localhost:8080
```

## Commandes pratiques 

- Compiler les styles scss en css
```shell
node-sass .\scss\main.scss .\scss\main.css
```