export default class Route {
    constructor(url, title, pathHtml, roles = []) {
        this.url = url;
        this.title = title;
        this.pathHtml = pathHtml;
        this.roles = roles;
    }
}