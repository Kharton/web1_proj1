document.addEventListener("DOMContentLoaded", function() {
    const productList = document.getElementById("product-list");
    const productForm = document.getElementById("product-form");

    // Carregar produtos armazenados
    function loadProducts() {
        productList.innerHTML = "";
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const product = JSON.parse(localStorage.getItem(key));
            const listItem = document.createElement("div");
            listItem.innerHTML = `<strong>${product.name}</strong> - R$ ${product.price} 
                                  <button onclick="editProduct('${key}')">Editar</button>
                                  <button onclick="deleteProduct('${key}')">Excluir</button>`;
            productList.appendChild(listItem);
        }
    }
    if(productList)
        loadProducts();

    if(productForm){
        // Adicionar produto
        productForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const name = document.getElementById("name").value;
            const price = parseFloat(document.getElementById("price").value);
            const productId = "product_" + Date.now();
            const product = { name, price };
            localStorage.setItem(productId, JSON.stringify(product));
            loadProducts();
            productForm.reset();
        });
    }

    // Editar produto
    window.editProduct = function(key) {
        const product = JSON.parse(localStorage.getItem(key));
        const newName = prompt("Novo nome:", product.name);
        const newPrice = parseFloat(prompt("Novo preço:", product.price));
        const updatedProduct = { name: newName, price: newPrice };
        localStorage.setItem(key, JSON.stringify(updatedProduct));
        loadProducts();
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
        // $('#result-hash').text('Hashing...');
        // $('#hash-result-container').removeClass('hidden');
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
        let elements = document.querySelectorAll('.dropdown.show');
        for(let i=0 ;i<elements.length;i++){
            if(elements[i] != element.parentElement)
                elements[i].classList.remove("show");
        }

        element.parentElement.classList.toggle("show");
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
    
});