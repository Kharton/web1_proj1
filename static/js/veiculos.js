document.addEventListener("DOMContentLoaded", function() {
    const veiculoList = document.getElementById("veiculoList");
    const veiculoForm = document.getElementById("veiculoForm");

    // Carregar veículos armazenados
    function loadVeiculos() {
        veiculoList.innerHTML = "";
        veiculos = localStorage.getItem("veiculos");
        if(!veiculos)
            return;
        veiculos = JSON.parse(veiculos);
        for (let i = 0; i < veiculos.length; i++) {
            for( let key in veiculos[i]){
                if(key == 'key')
                    continue;
                veiculo = veiculos[i][key];
                let listItem = document.querySelector('.veiculo-template').cloneNode(true);
                listItem.classList.remove("veiculo-template");
                listItem.style = '';
                let imagem = listItem.querySelector('img');
                let edit = listItem.querySelector('a.edit');
                let name = listItem.querySelector('.name');
                let description = listItem.querySelector('.description span');

                description.innerText = `${veiculo.modelo} - ${veiculo.ano}`;
                name.innerText = `${veiculo.marca}`;
                imagem.src = `${veiculo.foto}`;
                edit.onclick="editVeiculo('${key}')";
                edit.parentElement.innerHTML = `<a href="#" onclick="editVeiculo('${key}')" class="edit">Editar</a>
                                                <a href="#" onclick="deleteVeiculo('${key}')" class="remove")">Excluir</a>`;
            veiculoList.appendChild(listItem);
            }

        }
    }

    if(veiculoList)
        loadVeiculos();

    if(veiculoForm){
        // Adicionar veiculo
        veiculoForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const morador = document.querySelector("[name=morador]").value;
            if(!validaMorador(morador))
                return
            const marca = document.querySelector("[name=marca]").value;
            const modelo = document.querySelector("[name=modelo]").value;
            const ano = document.querySelector("[name=ano]").value;
            const cor = document.querySelector("[name=cor]").value;
            const foto = document.querySelector("[name=foto]");
            const key = document.querySelector("[name=key]").value;

            const identifier = key? key:"id" + Date.now();

            let veiculos = localStorage.getItem('veiculos');
            if(!veiculos)
                veiculos = []
            else{
                veiculos = JSON.parse(veiculos);
            }

            let file    = foto.files[0];
            let reader  = new FileReader();
          
            reader.onloadend = function () {
              const veiculo = {marca: marca, modelo: modelo, ano: ano, cor: cor, foto: reader.result};
              let tupla = {'key' : identifier};
              tupla[identifier] = veiculo;
              let veiculoIdentificado = veiculos.filter((x)=> x.key==identifier)[0];
              if(veiculoIdentificado){
                veiculoIdentificado[identifier] = veiculo
              }else{
                veiculos.push(tupla)
              }
              localStorage.setItem("veiculos",JSON.stringify(veiculos));
              loadVeiculos();
            }
          
            if (file) {
              reader.readAsDataURL(file);
            } else {
              preview.src = "";
            }

            veiculoForm.reset();
            document.querySelector("[name=key]").value = null;
            window.closeModal(this)
        });
    }

    // Editar veiculo
    window.editVeiculo = function(key) {
        const veiculos = JSON.parse(localStorage.getItem('veiculos'));
        let veiculosFiltrados = veiculos.filter(v=>v[key] != null);
        if(!veiculosFiltrados)
            return;

        for(let key in veiculosFiltrados[0]){
            if(key == 'key')
                continue;
            const veiculo = veiculosFiltrados[0][key];
            const marca = document.querySelector("[name=marca]").value = veiculo.marca;
            const modelo = document.querySelector("[name=modelo]").value = veiculo.modelo;
            const ano = document.querySelector("[name=ano]").value = veiculo.ano;
            const cor = document.querySelector("[name=cor]").value = veiculo.cor;
            const foto = document.querySelector("[name=foto]");
            document.querySelector("[name=key]").value = key;
            window.openModal("#modalVeiculo");
        }

    };

    // Excluir veiculo
    window.deleteVeiculo = function(key) {
        const veiculos = JSON.parse(localStorage.getItem('veiculos'));
        let veiculosFiltrados = veiculos.filter(v=>v[key] != null);
        if(!veiculosFiltrados || !veiculosFiltrados[0])
            return;
        if (confirm("Tem certeza que deseja excluir este veículo?")) {
            let index = veiculos.indexOf(veiculosFiltrados[0]);
            veiculos.splice(index,1);
            localStorage.setItem("veiculos",JSON.stringify(veiculos));
            localStorage.removeItem(key);
            loadVeiculos();
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