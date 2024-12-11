# Utiliser une image officielle Nginx
FROM nginx:latest

# Copier les fichiers HTML/CSS/JS dans le conteneur
COPY . /usr/share/nginx/html

# Exposer le port 80 pour le frontend
EXPOSE 80