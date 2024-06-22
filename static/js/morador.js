document.addEventListener("DOMContentLoaded", function() {
    const moradorList = document.getElementById("moradorList");
    const moradorForm = document.getElementById("moradorForm");

    // Carregar moradores armazenados
    function loadMoradores() {
        moradorList.innerHTML = "";
        let moradores = localStorage.getItem("moradores");
        if(!moradores)
            return;
        moradores = JSON.parse(moradores);
        for (let i = 0; i < moradores.length; i++) {
            for( let key in moradores[i]){
                if(key == 'key')
                    continue;
                const morador = moradores[i][key];
                let listItem = document.querySelector('.morador-item-template').cloneNode(true);
                listItem.classList.remove("morador-item-template");
                listItem.classList.toggle("morador-item");
                listItem.style = '';
                let imagem = listItem.querySelector('img');
                let edit = listItem.querySelector('a.edit');
                let name = listItem.querySelector('.name');
                let description = listItem.querySelector('.description span');

                description.innerText = `${morador.moradia}`;
                name.innerText = `${morador.name}`;
                imagem.src = `${morador.foto}`;
                edit.parentElement.innerHTML = `<a href="#" onclick="editMorador('${key}')" class="edit">Editar</a>
                                                <a href="#" onclick="deleteMorador('${key}')" class="remove")">Excluir</a>`;

                moradorList.appendChild(listItem);
            }
        }
    }
    
    if(moradorList)
        loadMoradores();

    if(moradorForm){
        // Adicionar morador
        moradorForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const name = document.querySelector("[name=nome]").value;
            const moradia = document.querySelector("[name=numero_moradia]").value;
            const nasc = document.querySelector("[name=data_nascimento]").value;
            const foto = document.querySelector("[name=foto]");
            const key = document.querySelector("[name=key]").value;

            const identifier = key? key:"morador_" + Date.now();

            let file    = foto.files[0];
            let reader  = new FileReader();

            let moradores = localStorage.getItem('moradores');
            if(!moradores)
                moradores = []
            else{
                moradores = JSON.parse(moradores);
            }
          
            reader.onloadend = function () {
              const morador = {name: name, moradia: moradia, nasc: nasc, foto: reader.result};
              let tupla = {'key' : identifier};
              tupla[identifier] = morador;
              let moradorIdentificado = moradores.filter((x)=> x.key==identifier)[0];
              if(moradorIdentificado)
                moradorIdentificado[identifier] = morador
              else
                moradores.push(tupla);
              localStorage.setItem("moradores", JSON.stringify(moradores));
              loadMoradores();
            }
          
            if (file) {
              reader.readAsDataURL(file);
            } else {
              preview.src = "";
            }

            moradorForm.reset();
            document.querySelector("[name=key]").value = null;
            window.closeModal(this)
        });
    }

    // Editar morador
    window.editMorador = function(key) {
        const moradores = JSON.parse(localStorage.getItem('moradores'));
        let moradoresFiltrados = moradores.filter(v=>v[key] != null);
        if(!moradoresFiltrados || !moradoresFiltrados[0])
            return;

        for(let key in moradoresFiltrados[0]){
            if(key == 'key')
                continue;
            const morador = moradoresFiltrados[0][key];
            const name = document.querySelector("[name=nome]").value = morador.name;
            const moradia = document.querySelector("[name=numero_moradia]").value = morador.moradia;
            const nasc = document.querySelector("[name=data_nascimento]").value = morador.nasc;
            const foto = document.querySelector("[name=foto]");
            document.querySelector("[name=key]").value = key;
            window.openModal("#modalMorador");
        }

    };

    // Excluir morador
    window.deleteMorador = function(key) {
        const moradores = JSON.parse(localStorage.getItem('moradores'));
        let moradoresFiltrados = moradores.filter(v=>v[key] != null);
        if(!moradoresFiltrados || !moradoresFiltrados[0])
            return;
        if (confirm("Tem certeza que deseja excluir este morador?")) {
            let index = moradores.indexOf(moradoresFiltrados[0]);
            moradores.splice(index,1);
            localStorage.setItem("moradores",JSON.stringify(moradores));
            loadMoradores();
        }
    };
    
});