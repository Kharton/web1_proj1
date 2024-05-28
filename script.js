document.addEventListener("DOMContentLoaded", function() {
    const moradorList = document.getElementById("moradorList");
    const moradorForm = document.getElementById("moradorForm");

    // Carregar produtos armazenados
    function loadProducts() {
        moradorList.innerHTML = "";
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const product = JSON.parse(localStorage.getItem(key));
            let listItem = document.querySelector('.morador-item-template').cloneNode(true);
            listItem.classList.remove("morador-item-template");
            listItem.classList.toggle("morador-item");
            listItem.style = '';
            let imagem = listItem.querySelector('img');
            let edit = listItem.querySelector('a.edit');
            let name = listItem.querySelector('.name');
            let description = listItem.querySelector('.description span');

            description.innerText = `${product.moradia}`;
            name.innerText = `${product.name}`;
            imagem.src = `${product.foto}`;
            edit.onclick="editProduct('${key}')";
            edit.parentElement.innerHTML = `<a href="#" onclick="editProduct('${key}')" class="edit">Editar</a>
                                            <a href="#" onclick="deleteProduct('${key}')" class="remove")">Excluir</a>`;

            moradorList.appendChild(listItem);
        }
    }
    if(moradorList)
        loadProducts();

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
          
            reader.onloadend = function () {
              const product = {name: name, moradia: moradia, nasc: nasc, foto: reader.result};
              localStorage.setItem(identifier, JSON.stringify(product));
              loadProducts();
            }
          
            if (file) {
              reader.readAsDataURL(file);
            } else {
              preview.src = "";
            }

            moradorForm.reset();
            window.closeModal(this)
        });
    }

    // Editar produto
    window.editProduct = function(key) {
        const product = JSON.parse(localStorage.getItem(key));
        
        const name = document.querySelector("[name=nome]").value = product.name;
        const moradia = document.querySelector("[name=numero_moradia]").value = product.moradia;
        const nasc = document.querySelector("[name=data_nascimento]").value = product.nasc;
        const foto = document.querySelector("[name=foto]");
        document.querySelector("[name=key]").value = key;
        window.openModal("#modalMorador");

    };

    // Excluir produto
    window.deleteProduct = function(key) {
        if (confirm("Tem certeza que deseja excluir este produto?")) {
            localStorage.removeItem(key);
            loadProducts();
        }
    };
    
    window.menuClick = function() {
        sidebarToggle(document.getElementById("sidebarmenu").style.display == "block");
    }
    
    window.sidebarToggle = function(close) {
        var display = close ? "none":"block";
        document.getElementById("sidebarmenu").style.display = display;
        document.getElementById("inputblock").style.display = display;
    }

    function encrypt(){
        let string = $('#encrypt-string').val(); //textoencriptado
        let rounds = parseInt($('#rounds').val()); //salt

        bcrypt.genSalt(rounds, function (err, salt) {
            bcrypt.hash(string, salt, function (err, hash) {
                $('#result-hash').text(hash);
            });
        });
    }

    window.updateTitle = function(){
        let pathArray = window.location.href.split('/');
        let subtitle = pathArray[pathArray.length-1].replace('.html','');
        if(subtitle != 'index'){
            document.title += ` - ${capitalize(subtitle)}`;
        }
    }

    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    
    window.updateTitle();
    
    window.dropdownToggle = function(element) {
        x=element;
        window.closeDropdown(element);

        element.parentElement.classList.toggle("show");
    }
    
    window.closeDropdown = function(element){
        let elements = document.querySelectorAll('.dropdown.show');
        for(let i=0 ;i<elements.length;i++){
            if(!element || elements[i] != element.parentElement)
                elements[i].classList.remove("show");
        }
    }

    window.openModal = function(ref){
        document.querySelector(ref).style.display = "block";
        document.getElementById("inputblockModal").style.display = "block";
        let sequence = document.getElementById("inputblockModal").dataset['sequence'];
        if(!sequence){
            sequence = []
        }else{
            sequence = sequence.split(',');
        }
        sequence.push(ref);
        document.getElementById("inputblockModal").dataset['sequence'] = sequence;
        window.closeDropdown();
    }

    window.closeModal = function(ref){
        let display = 'none';
        ref.parentElement.parentElement.style.display = display;
        let sequence = document.getElementById("inputblockModal").dataset['sequence'].split(',');
        if(sequence.length){
            if(`#${ref.parentElement.parentElement.id}` == sequence[sequence.length-1]){
                sequence.pop();
                document.getElementById("inputblockModal").dataset['sequence'] = sequence;
                if(!sequence.length){
                    document.getElementById("inputblockModal").style.display = 'none';
                }
            }
        }
    }

    window.closeModalBack = function(element){
        let sequence = element.dataset['sequence'].split(',');
        let ref = sequence.pop()
        window.closeModal(document.querySelector(ref+' .modal-content .close'));
        if(sequence.length == 0){
            document.getElementById("inputblockModal").style.display = 'none';
        }
    }

    function preview(input){
        var file    = input.files[0];
        var reader  = new FileReader();
      
        reader.onloadend = function () {
          preview.src = reader.result;
        }
      
        if (file) {
          reader.readAsDataURL(file);
        } else {
          preview.src = "";
        }
    }
    
});