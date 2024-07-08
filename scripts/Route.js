export default class Route {
    constructor(url, title, pathHtml, pathJS = "", apiUrl="", fetchData = false) {
        this.url = url;
        this.title = title;
        this.pathHtml = pathHtml;
        this.pathJS = pathJS;
        this.apiUrl = apiUrl;
        this.fetchData = fetchData;
    }
}