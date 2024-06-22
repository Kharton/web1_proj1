document.addEventListener("DOMContentLoaded", function() {
    const noticiaList = document.getElementById("noticiaList");
    const noticiaForm = document.getElementById("noticiaForm");

    // Carregar veículos armazenados
    function loadNoticias() {
        noticiaList.innerHTML = "";
        noticias = localStorage.getItem("noticias");
        if(!noticias)
            return;
        noticias = JSON.parse(noticias);
        for (let i = 0; i < noticias.length; i++) {
            for( let key in noticias[i]){
                if(key == 'key')
                    continue;
                noticia = noticias[i][key];
                let listItem = document.querySelector('.noticia-template').cloneNode(true);
                listItem.classList.remove("noticia-template");
                listItem.style = '';
                let imagem = listItem.querySelector('img');
                let edit = listItem.querySelector('a.edit');
                let name = listItem.querySelector('.name');
                let description = listItem.querySelector('.description span');

                description.innerText = `${noticia.modelo} - ${noticia.ano}`;
                name.innerText = `${noticia.marca}`;
                imagem.src = `${noticia.foto}`;
                edit.onclick="editNoticia('${key}')";
                edit.parentElement.innerHTML = `<a href="#" onclick="editNoticia('${key}')" class="edit">Editar</a>
                                                <a href="#" onclick="deleteNoticia('${key}')" class="remove")">Excluir</a>`;
            noticiaList.appendChild(listItem);
            }

        }
    }

    if(noticiaList)
        loadNoticias();

    if(noticiaForm){
        // Adicionar noticia
        noticiaForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const morador = document.querySelector("[name=morador]").value;
            if(!validaMorador(morador))
                return
            const titulo = document.querySelector("[name=titulo]").value;
            const corpo = document.querySelector("[name=corpo]").value;
            const foto = document.querySelector("[name=foto]");
            const key = document.querySelector("[name=key]").value;

            const identifier = key? key:"id" + Date.now();

            let noticias = localStorage.getItem('noticias');
            if(!noticias)
                noticias = []
            else{
                noticias = JSON.parse(noticias);
            }

            let file    = foto.files[0];
            let reader  = new FileReader();
          
            reader.onloadend = function () {
              const noticia = {marca: marca, modelo: modelo, ano: ano, cor: cor, foto: reader.result};
              let tupla = {'key' : identifier};
              tupla[identifier] = noticia;
              let noticiaIdentificado = noticias.filter((x)=> x.key==identifier)[0];
              if(noticiaIdentificado){
                noticiaIdentificado[identifier] = noticia
              }else{
                noticias.push(tupla)
              }
              localStorage.setItem("noticias",JSON.stringify(noticias));
              loadNoticias();
            }
          
            if (file) {
              reader.readAsDataURL(file);
            } else {
              preview.src = "";
            }

            noticiaForm.reset();
            document.querySelector("[name=key]").value = null;
            window.closeModal(this)
        });
    }

    // Editar noticia
    window.editNoticia = function(key) {
        const noticias = JSON.parse(localStorage.getItem('noticias'));
        let noticiasFiltrados = noticias.filter(v=>v[key] != null);
        if(!noticiasFiltrados)
            return;

        for(let key in noticiasFiltrados[0]){
            if(key == 'key')
                continue;
            const noticia = noticiasFiltrados[0][key];
            const marca = document.querySelector("[name=marca]").value = noticia.marca;
            const modelo = document.querySelector("[name=modelo]").value = noticia.modelo;
            const ano = document.querySelector("[name=ano]").value = noticia.ano;
            const cor = document.querySelector("[name=cor]").value = noticia.cor;
            const foto = document.querySelector("[name=foto]");
            document.querySelector("[name=key]").value = key;
            window.openModal("#modalNoticia");
        }

    };

    // Excluir noticia
    window.deleteNoticia = function(key) {
        const noticias = JSON.parse(localStorage.getItem('noticias'));
        let noticiasFiltrados = noticias.filter(v=>v[key] != null);
        if(!noticiasFiltrados || !noticiasFiltrados[0])
            return;
        if (confirm("Tem certeza que deseja excluir este veículo?")) {
            let index = noticias.indexOf(noticiasFiltrados[0]);
            noticias.splice(index,1);
            localStorage.setItem("noticias",JSON.stringify(noticias));
            localStorage.removeItem(key);
            loadNoticias();
        }
    };

    window.loadMoradoresList = function(){
        let listaMoradores = document.querySelector("#moradores")

        listaMoradores.innerHTML = "";

        let moradores = localStorage.getItem("moradores");
        if(!moradores)
            return;
        moradores = JSON.parse(moradores);
        for (let i = 0; i < moradores.length; i++) {
            for( let key in moradores[i]){
                if(key == 'key')
                    continue;
                const morador = moradores[i][key];
                var opcao = document.createElement('option')
                opcao.value = `${morador.name}`;
                listaMoradores.appendChild(opcao);
            }
        }
    }
    window.loadMoradoresList();

    function validaMorador(nome){
        for(let i =0;i<document.querySelector("#moradores").options.length;i++){
            if(nome == document.querySelector("#moradores").options[i].value)
                return true;
        }
        alert('O morador informado não esta cadastrado!');
        return false;
    }
});