document.addEventListener("DOMContentLoaded", function() {
    const noticiaList = document.getElementById("noticiaList");

    // Carregar veículos armazenados
    function loadNoticias() {
        noticias = localStorage.getItem("noticias");
        if(!noticias)
            return;
        noticiaList.innerHTML = "";
        noticias = JSON.parse(noticias);
        for (let i = 0; i < noticias.length; i++) {
            for( let key in noticias[i]){
                if(key == 'key')
                    continue;
                noticia = noticias[i][key];
                let listItem = document.querySelector('.noticia-template').cloneNode(true);
                listItem.classList.remove("noticia-template");
                listItem.style = '';
                let title = listItem.querySelector('.title');
                let corpo = listItem.querySelector('.corpo');
                title.classList.remove("title");
                corpo.classList.remove('corpo');

                corpo.innerText = `${noticia.corpo}`;
                title.innerText = `${noticia.titulo}`;
            noticiaList.appendChild(listItem);
            }

        }
    }

    if(noticiaList)
        loadNoticias();
});