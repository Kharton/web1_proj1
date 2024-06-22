document.addEventListener("DOMContentLoaded", function() {
    
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