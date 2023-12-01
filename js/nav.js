async function readHTML() {
    let urlActual = window.location.href;
    let url= urlActual.substring(0, urlActual.lastIndexOf("/"));
    let ruta = url + "/nav.html"

    try {
        const response = await fetch(ruta);
        const textString = await response.text();
        return textString;
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        return null;
    }
}
async function insertHTML() {
    const htmlCode = await readHTML();

    if (htmlCode !== null) {
        const container = document.getElementById("nav-menu");
        container.innerHTML = htmlCode;

        let badpath = window.location.pathname;
        let filter = badpath.split('/');
        let path = filter.slice(2).join('/');
        let links = document.querySelectorAll(".link");

        let linkIDs = [];
        links.forEach(link => {
            linkIDs.push(link.getAttribute("id"));
        });
        for(let i=0; i<linkIDs.length; i++){
            if(linkIDs[i]==path){
                let element =document.getElementById(linkIDs[i]);
                element.classList.add("active");
            }
            if (path == "") {
                let element = document.getElementById("index.html");
                element.classList.add("active");
            }
        }
    }
}

insertHTML();

