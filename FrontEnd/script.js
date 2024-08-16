// Déclaration des variables
const url = 'http://localhost:5678/api/' // Début de l'adresse de l'api

// Code nécessaire en mode visiteur
let donneesWorks = []; // Création variable global pour stocker les travaux reçue par l'api
let donneesCategorys = [];

document.addEventListener('DOMContentLoaded', async () => { // Permet d'appeler les fonctions en fonction des actions utilisateurs réalisés
    const currentPage = window.location.pathname; // récupère l'url
    const currentPageLastCaract = currentPage.slice(-10); //récupère les 10 derniers caratères (index.html ou login.html actuellmement)
    const token = sessionStorage.getItem('token'); // Récupere le token
    
    if (currentPageLastCaract === 'index.html' && token === null){
        await getWorks(); // Ligne 28
        await getCategories(); // Ligne 45
        displayWorks(donneesWorks); // Ligne 63
        displayCategory(donneesCategorys); // Ligne 79
    } else if (currentPageLastCaract === 'index.html' && token !== null) {
        await getWorks(); // Ligne 28
        await getCategories();
        displayWorks(donneesWorks); // Ligne 63
        displayLogin(); //Ligne 250
        openModal ();
    } else if (currentPageLastCaract === 'login.html') {
        sendValueEmailPassword(); // Ligne 177
    }
 // A afficher uniquement si on est pas connecter
});

async function getWorks() { // Appel à l'api pour récuperer les Travaux 
    try { 
        const requete = await fetch(url + 'works', {
            method: 'GET'
        });

        if (!requete.ok) {
            throw new Error('Un problème est survenu sur la récupération des travaux.');
        }
        donneesWorks = [];
        donneesWorks = await requete.json(); // Récupération des données Works depuis l'api
        return donneesWorks;    // Retour des données Works lors de l'appel
    } catch (error) {
        alert(error.message);
    }
}

async function getCategories () { // Appel à l'api pour récuperer les Categories 
    try {
        const requete = await fetch (url + 'categories', {
            method: 'GET'
        });
    
        if (!requete.ok){
            throw new Error('Un problème est survenu sur la récupération des catégories.');
        } 
            
        donneesCategorys = await requete.json(); // Récupération des données Categories depuis l'api
        return donneesCategorys;  // Retour des données Categories lors de l'appel
        
    } catch (error) {
        alert(error.message);
    }
}

function displayWorks (donneesWorks) { // Permet d'afficher les travaux sur le portfolio
    let galleryDiv = document.querySelector('.gallery');
    galleryDiv.innerHTML = ''; // Reinitialise à chaque appel de la fonction pour éviter les répétitions
    // Évite la création en boucle de la variable 
    let figure; 

    donneesWorks.forEach(work => { // Boucle forEach sur tout les travaux afin de les afficher 1 par 1
        figure = document.createElement('figure');
        figure.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}">
        <figcaption>${work.title}</figcaption>`;
        galleryDiv.appendChild(figure);
    });        
}


function displayCategory(donneesCategorys) { // Permet d'afficher les catégories sur le portfolio

    // Création et ajout de la div 'divCategories' au DOM, conteneur de chacune des catégories
    let divTitleAndDisplayCategories = document.querySelector('#display_modify_work'); 
    let divCategories = document.createElement('div');
    divTitleAndDisplayCategories.appendChild(divCategories);
    
    // Instruction du comportement visuel de 'divCategories'
    divCategories.style.marginTop = '50px';
    divCategories.style.marginBottom = '50px';
    divCategories.style.display = 'flex';
    divCategories.style.justifyContent = 'center';
    divCategories.style.gap = '15px';

    // Création de la catégorie 'Tous' hors de la boucle car non présente dans l'API
    let allCategoryButton = document.createElement('button');
    allCategoryButton.textContent = 'Tous';
    allCategoryButton.className = 'category_project';
    allCategoryButton.id = 'category_tous';
    allCategoryButton.style.fontSize = '16px';
    allCategoryButton.style.fontWeight = '700';
    allCategoryButton.style.fontFamily = 'Syne';
    allCategoryButton.style.backgroundColor = '#1D6154';
    allCategoryButton.style.color = 'white';
    allCategoryButton.style.border = 'solid 1px #1D6154';
    allCategoryButton.style.borderRadius = '60px';
    allCategoryButton.style.padding = '10px 20px';
    
    // Ajouter l'événement de clic pour le bouton 'Tous'
    allCategoryButton.addEventListener('click', () => {
        document.querySelectorAll('.category_project').forEach(btn => {
            btn.style.backgroundColor = 'white';
            btn.style.color = '#1D6154';
        });
        allCategoryButton.style.backgroundColor = '#1D6154';
        allCategoryButton.style.color = 'white';

        // Afficher Tous les projets
        galleryDiv = document.querySelector('.gallery');
        galleryDiv.innerHTML = '';

        donneesWorks.forEach(work =>{ // Ici pas de condition nécessaire
            figure = document.createElement('figure');
            figure.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>`;
            galleryDiv.appendChild(figure);
                
            });        
    });

    divCategories.appendChild(allCategoryButton);

    // Création des boutons de catégories depuis les données de l'API
    donneesCategorys.forEach(dataCategory => { 
        let categoryButton = document.createElement('button');
        categoryButton.textContent = dataCategory.name;
        categoryButton.className = 'category_project';
        categoryButton.id = dataCategory.id;
        categoryButton.style.fontSize = '16px';
        categoryButton.style.fontWeight = '700';
        categoryButton.style.fontFamily = 'Syne';
        categoryButton.style.backgroundColor = 'white';
        categoryButton.style.color = '#1D6154';
        categoryButton.style.border = 'solid 1px #1D6154';
        categoryButton.style.borderRadius = '60px';
        categoryButton.style.padding = '10px 20px';
        
        // Ajouter un événement de clic pour chaque bouton de catégorie
        categoryButton.addEventListener('click', () => {
            // Réinitialiser le style de tous les boutons de catégorie
            document.querySelectorAll('.category_project').forEach(btn => {
                btn.style.backgroundColor = 'white';
                btn.style.color = '#1D6154';
            });

            // Appliquer le style au bouton cliqué
            categoryButton.style.backgroundColor = '#1D6154';
            categoryButton.style.color = 'white';

            // Afficher les projets correspondants à la catégorie souhaité
            galleryDiv = document.querySelector('.gallery');
            galleryDiv.innerHTML = '';

            donneesWorks.forEach(work =>{ // Pour chaque travaux si la condition est respecter alors on affiche le projet
                if (dataCategory.id === work.categoryId) {
                    figure = document.createElement('figure');
                    figure.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}">
                    <figcaption>${work.title}</figcaption>`;
                    galleryDiv.appendChild(figure);
                }
            });
        });

        divCategories.appendChild(categoryButton);
    });
}


function sendValueEmailPassword () { // Permet de récuperer les valeurs Email et Password au click de submit pour les transférer dans la requete API 
    let loginEventListener = document.getElementById('login-form');
    loginEventListener.addEventListener('submit', function (e){
        e.preventDefault();

        let errorMessage = document.querySelector('#error_message'); // Permet que si il y a déjà un message d'erreur le supprimer pour ne pas l'écrire plusieurs fois 
        if (errorMessage !== null) {
        let email = document.querySelector('#email');
        let password = document.querySelector('#password');
        email.style.border = 'none'
        password.style.border = 'none'
        errorMessage.remove();
    }
            
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
            
        let emailPassword = {
                    email : email,
                    password : password
                }
            
                postUsersLogin(emailPassword)
        });
}

async function postUsersLogin(emailPassword) { // Appel à l'api avec dans le body les valeurs de input rentré par l'utilisateur
        const requete = await fetch(url + 'users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailPassword)
        });

        if (requete.ok) { // Réponse 200 Email et mot de passe correct connexion autorisé
            const reponse = await requete.json();
            sessionStorage.setItem('token', reponse.token); // Récupère le token depuis reponse
            window.location.href = 'index.html';
        } else if (requete.status === 404) { // Email et mot de passe incorrect 

            let email = document.querySelector('#email');
            let password = document.querySelector('#password');
            let passwordFold = document.querySelector('#password-fold');
            email.style.border = '1px solid red'
            password.style.border = '1px solid red'
            let errorMessage = document.createElement('p');
            errorMessage.textContent = 'Votre adresse email ainsi que votre mot de passe sont incorrects';
            errorMessage.id = 'error_message'
            errorMessage.style.color = 'red'
            errorMessage.style.margin = '20px'
            let parent = passwordFold.parentNode;
            parent.insertBefore(errorMessage, passwordFold)

        } else if (requete.status === 401) { // Mot de passe incorrect

            let password = document.querySelector('#password');
            let passwordFold = document.querySelector('#password-fold');
            password.style.border = '1px solid red'
            let errorMessage = document.createElement('p');
            errorMessage.id = 'error_message'
            errorMessage.textContent = 'Votre mot de passe est incorrect';
            errorMessage.style.color = 'red'
            errorMessage.style.margin = '20px'
            let parent = passwordFold.parentNode;
            parent.insertBefore(errorMessage, passwordFold)

        } else {
            alert ('Erreur inattentue, merci de rafraîchir la page');
        }

}

function displayLogin () { // Modifie les éléments du DOM quand un utilisateur est connecter

    // Barre Top Page 
    let header = document.querySelector('#index_header');
    let divModeBar = document.createElement('div');
    let divImgP = document.createElement('div');
    let iconSVG = document.createElement('img');
    let editionP = document.createElement('p');

    divModeBar.style.width = '100%';
    divModeBar.style.height = '59px';
    divModeBar.style.backgroundColor = '#000000';
    divModeBar.style.position = 'absolute';
    divModeBar.style.left = '0';
    divModeBar.style.top = '0';

    divImgP.style.display = 'flex';
    divImgP.style.gap = '21px'
    divImgP.style.justifyContent = 'center';
    divImgP.style.marginTop = '20px';

    header.style.paddingTop = '96px';
    let parent = header.parentNode;
    parent.insertBefore(divModeBar, header)

    iconSVG.src = './assets/icons/Vector.svg';
    iconSVG.alt = 'Icon mode édition';
    iconSVG.style.width = '16px';
    iconSVG.style.height = '16px';

    editionP.textContent = 'Mode édition';
    editionP.style.color = 'white';
    editionP.style.fontSize = '16px';
    editionP.style.fontWeight = '400';
    editionP.style.fontFamily = 'Work Sans';

    divModeBar.appendChild(divImgP);
    divImgP.appendChild(iconSVG);
    divImgP.appendChild(editionP);

    // Affiche Logout au lieu de Login
    logStatus = document.querySelector('#log_status');
    logStatus.textContent = '';
    logStatus.textContent = 'logout';

    // Affiche modifier pour permettre l'ouverture de la modale
    let div = document.querySelector('#display_modify_work');
    let myProject = document.querySelector('#projets');
    let divImgPModifyWork = document.createElement('div');
    let iconSVGModifyWork = document.createElement('img');
    let modify = document.createElement('p');

    div.style.display = 'flex';
    div.style.justifyContent = 'center';
    div.style.alignItems = 'center';
    div.style.gap = '31px';
    div.style.marginTop = '139px';
    div.style.marginBottom = '92px';

    myProject.style.margin = '0px'

    divImgPModifyWork.id = 'open_modal';
    divImgPModifyWork.style.display = 'flex';
    divImgPModifyWork.style.gap = '10px';

    iconSVGModifyWork.src = './assets/icons/Group.svg';
    iconSVGModifyWork.alt = 'Icon mode édition';
    iconSVGModifyWork.style.width = '16px';
    iconSVGModifyWork.style.height = '16px';

    modify.textContent = 'modifier';
    modify.style.color = '#000000';
    modify.style.fontSize = '14px';
    modify.style.fontWeight = '400';
    modify.style.fontFamily = 'Work Sans';

    div.appendChild(divImgPModifyWork);
    divImgPModifyWork.appendChild(iconSVGModifyWork);
    divImgPModifyWork.appendChild(modify);

}

function openModal () { // Permet d'ouvrir la modal sur Ajout Photo

    let openModal = document.querySelector('#open_modal');
    openModal.addEventListener('click', function(){
        
        // Création de la div qui prendra toutes la page avec le background assombrie
        let modalBackground = document.createElement('div');
        modalBackground.className = 'all_modal'
        modalBackground.style.position = 'fixed';
        modalBackground.style.top = '0';
        modalBackground.style.left = '0';
        modalBackground.style.width = '100%';
        modalBackground.style.height = '100%';
        modalBackground.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        modalBackground.style.zIndex = '1';
    
        // Création du fond et forme de la modal ainsi que son positionnement
        let modal = document.createElement('div');
        modal.className = 'all_modal';
        modal.id = 'modal';
        modal.style.position = 'fixed';
        modal.style.backgroundColor = 'white';
        modal.style.top = '405px';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, 0%)';
        modal.style.width = '630px';
        modal.style.zIndex = '2';
        modal.style.borderRadius = '10px';
        modal.style.display = 'flex';
        modal.style.flexDirection = 'column';
        modal.style.alignItems = 'center';
        
        // Création de la partie header de la modale Retour - Titre - Croix de fermeture
        let headerModal = document.createElement('div');
        headerModal.className = '.all_modal'
        headerModal.id = 'header_modal'
        headerModal.style.width = '100%';
        headerModal.style.display = 'flex';
        headerModal.style.justifyContent = 'space-between'
    
        // Permet d'inserer le block contenant l'icon de retour permet ici le fonctionnement de space-between
        let divBack = document.createElement('div');
        divBack.className = 'all_modal';
        divBack.id = 'test';       
        divBack.style.marginTop = '26px';
        divBack.style.marginLeft = '26px';
        divBack.style.width = '21px';
        divBack.style.height = '21px';
        
        // Permet d'inserer l'icon de retour pour l'instant l'élément est caché
        let back = document.createElement('img');
        back.className = '.all_modal'
        back.id = 'back_icon';
        back.className = 'all_modal';
        back.src = './assets/icons/arrow.svg';
        back.style.width = '21px';
        back.style.height = '21px';
        back.style.display = 'none';
        
        // Création du titre de la modale
        let title = document.createElement('h3');
        title.className = 'all_modal';
        title.id = 'title_modal';
        title.textContent = 'Galerie Photo'
        title.style.marginTop = '60px';
        title.style.marginBottom = '46px';
        title.style.fontFamily = 'Work Sans';
        title.style.fontWeight = '400';
        title.style.fontSize = '26px';
        
        // Création du block contenant l'icon de fermeture de la modale
        let divClose = document.createElement('div');
        divClose.className = 'all_modal'
        divClose.style.marginTop = '26px';
        divClose.style.marginRight = '26px';
        
        // Icon de fermeture de la modale
        let close = document.createElement('img');
        close.className = 'all_modal';
        close.id = 'close_modal';
        close.src = './assets/icons/close.svg';
        close.style.width = '24px';
        close.style.height = '24px';
    
        // Permet d'inserer la barre présente en dessous des projets 
        let bar = document.createElement('div');
        bar.className = '.all_modal';
        bar.id = 'div_bar_modal';
        bar.style.width = '420px'
        bar.style.borderTop = 'solid 1px #B3B3B3'
        bar.style.marginTop = '47px';
        bar.style.marginLeft = 'auto';
        bar.style.marginRight = 'auto'; 
        bar.style.marginBottom = '37px';
        
        // Création du block contenant le bouton Ajouter une photo
        let divButton = document.createElement('div');
        divButton.className = '.all_modal'
        divButton.style.width = '100%';
        divButton.style.display = 'flex';
        divButton.style.justifyContent = 'center';
        divButton.style.marginBottom = '45px';
    
        // Bouton Ajouter une photo
        let button = document.createElement('button');
        button.className = '.all_modal'
        button.id = 'button_add_picture_first_modal';
        button.textContent = 'Ajouter une photo'
        button.style.width = '237px';
        button.style.height = '36px';
        button.style.borderRadius = '60px';
        button.style.backgroundColor = '#1D6154';
        button.style.color = 'white';
        button.style.fontWeight = '700';
        button.style.fontSize = '14px';
        button.style.fontFamily = 'Syne';
        button.style.border = 'none';
    

        
        // Partie insertion de la modale
        document.body.appendChild(modalBackground);
        document.body.appendChild(modal);
        modal.appendChild(headerModal);
        divBack.appendChild(back);
        divClose.appendChild(close);
        headerModal.appendChild(divBack);
        headerModal.appendChild(title);
        headerModal.appendChild(divClose)
        modal.appendChild(bar);
        modal.appendChild(divButton);
        divButton.appendChild(button);

        // Permet d'acceder à Ajouter une photo de la modale
         button.addEventListener('click', function (){
            displayModalAddPicture ()
        });

        displayWorkModal();
        closeModal(close);
    });   
}
function displayWorkModal () {

     // Partie affichage travaux dans la modale

        // Création du conteneur contenant les travaux
        headerModal = document.querySelector('#header_modal'); 
        let divWork = document.getElementById('modal_display_work');

        if (!divWork) { // Si divWork n'existe pas alors on créer le conteneur qui acceuillera les travaux
            divWork = document.createElement ('div');
            divWork.className = '.all_modal'
            divWork.id = 'modal_display_work';
            divWork.style.width = '425px';
            divWork.style.display = 'grid';
            divWork.style.gridTemplateColumns = '1fr 1fr 1fr 1fr 1fr';
            divWork.style.gap = '10px'

            // Insertion du conteneur accueillant les travaux
            headerModal.after(divWork);
        } else { // Sinon On supprime dans une boucle chacun des travaux 1 par 1
            let divWork = document.getElementById('modal_display_work');
            if (divWork) {
                while (divWork.firstChild) {
                    divWork.removeChild(divWork.firstChild);
                }
            }
        }


            // Boucle sur donneesWorks contenant les travaux pour les afficher un par un dans divWork
        let imgWork, imgDeleteWork, workContainerModal;
        for (let i = 0 ; i < (donneesWorks.length); i++) {
    
            // Création du conteneur qui contiendra l'img du travail ainsi que la croix de suppression du travail
            workContainerModal = document.createElement('div');
            workContainerModal.style.position = 'relative';
            workContainerModal.className = '.all_modal';
    
            // Ajout de l'image contenant le travail
            imgWork = document.createElement('img');
            imgWork.className = '.all_modal';
            imgWork.src = donneesWorks[i].imageUrl;
            imgWork.style.width = '76px';
            imgWork.style.height = '102px';
            imgWork.style.marginBottom = '22px';
    
            // Ajout de l'icon de suppression du travail
            imgDeleteWork = document.createElement('img');
            imgDeleteWork.className = 'all_modal';
            imgDeleteWork.src = './assets/icons/delete_button.svg';
            imgDeleteWork.className = 'img_delete_work';
            imgDeleteWork.style.position = 'absolute';
            imgDeleteWork.style.width = '17px';
            imgDeleteWork.style.height = '17px';
            imgDeleteWork.style.top = '6px';
            imgDeleteWork.style.left = '55px';
    
            imgDeleteWork.addEventListener('click', () => {
                let workToBeDelete = donneesWorks[i];
    
                // Suppression dans la variable donneesWorks du travail demandé
                donneesWorks.splice(i, 1);
                deleteWork(workToBeDelete);
                displayWorkModal();
            })
    
            // Insertion des éléments dans le DOM
            workContainerModal.appendChild(imgWork);
            workContainerModal.appendChild(imgDeleteWork);
            divWork.appendChild(workContainerModal);
        }
}

function displayModalAddPicture () {

    // Récuperer les éléments qui sont à modifier pour la modale Ajout Photo
    let title = document.querySelector('#title_modal'); 
    title.textContent = 'Ajout Photo';
    let divWork = document.querySelector('#modal_display_work'); 
    let buttonAddPictureFirstModal = document.querySelector('#button_add_picture_first_modal');
    buttonAddPictureFirstModal.remove(); 

    if (divWork !== null) {
        divWork.remove();
    }   
    
    
    let button = document.createElement('button');
    button.className = '.all_modal'
    button.id = 'button_add_picture_first_modal';
    button.textContent = 'Valider'
    button.style.width = '237px';
    button.style.height = '36px';
    button.style.borderRadius = '60px';
    button.style.backgroundColor = '#1D6154';
    button.style.color = 'white';
    button.style.fontWeight = '700';
    button.style.fontSize = '14px';
    button.style.fontFamily = 'Syne';
    button.style.border = 'none';
    
    let divBar = document.querySelector('#div_bar_modal');
    divBar.insertAdjacentElement('afterend', button);

            //Div pour l'ajout des photos
            let divInsertPicture = document.createElement('div');
            divInsertPicture.id = 'div_Insert_Picture'
            divInsertPicture.style.width = '420px';
            divInsertPicture.style.backgroundColor = '#E8F1F6';
            divInsertPicture.style.display = 'flex';
            divInsertPicture.style.flexDirection = 'column';
            divInsertPicture.style.alignItems = 'center';
            divInsertPicture.style.marginBottom = '30px';
    
            //L'interieur de la div divInsertPhoto
    
            //Icon
            let iconAddPicture = document.createElement('img');
            iconAddPicture.src = './assets/icons/add_picture.svg';
            iconAddPicture.alt = 'Icon ajouter photos';
            iconAddPicture.style.width = '76px';
            iconAddPicture.style.height = '76px';
            iconAddPicture.style.marginTop = '13px';
    
            // Bouton
            let buttonAddPicture = document.createElement('button');
            buttonAddPicture.textContent = '+ Ajouter photo';
            buttonAddPicture.style.marginTop = '6px';
            buttonAddPicture.style.width = '173px';
            buttonAddPicture.style.height = '36px';
            buttonAddPicture.style.borderRadius = '50px';
            buttonAddPicture.style.backgroundColor = '#CBD6DC';
            buttonAddPicture.style.border = 'none';
            buttonAddPicture.style.color = '#306685';
            buttonAddPicture.style.fontFamily = 'Work Sans';
            buttonAddPicture.style.fontWeight = '500';
            buttonAddPicture.style.fontSize = '14px';
    
            // Paragraphe
            let paragraphAddPicture = document.createElement('p');
            paragraphAddPicture.textContent = 'jpg, png : 4mo max';
            paragraphAddPicture.style.marginTop = '7px';
            paragraphAddPicture.style.fontFamily = 'Work Sans';
            paragraphAddPicture.style.fontWeight = '400';
            paragraphAddPicture.style.fontSize = '10px';
            paragraphAddPicture.style.color = '#444444';
            paragraphAddPicture.style.marginBottom = '19px';    
    
            //Formulaire
            let formAddPicture = document.createElement('form');
            formAddPicture.id = 'form_add_picture';
            formAddPicture.method = 'POST';
            formAddPicture.action = url + 'works';
            formAddPicture.enctype = 'multipart/form-data';
            formAddPicture.style.width = '420px';
            formAddPicture.style.display = 'flex'
            formAddPicture.style.flexDirection = 'column';
    
             //Div Titre & Catégorie
             let divTitleCategory = document.createElement('div')
             divTitleCategory.style.width = '420px';
             divTitleCategory.style.display = 'flex';
             divTitleCategory.style.flexDirection = 'column'; 
    
            //Label titre
            let labelTitleAddPicture = document.createElement('label');
            labelTitleAddPicture.textContent = 'Titre';
            labelTitleAddPicture.className = 'form_add_picture';
            labelTitleAddPicture.for = 'title';
            labelTitleAddPicture.style.fontWeight = 'Work Sans';
            labelTitleAddPicture.style.fontWeight = '500';
            labelTitleAddPicture.style.fontSize = '14px';
            labelTitleAddPicture.style.color = '#3D3D3D';
    
            //Input Titre
            let inputTitleAddPicture = document.createElement('input');
            inputTitleAddPicture.className = 'form_add_picture';
            inputTitleAddPicture.type = 'text';
            inputTitleAddPicture.name = 'text_title_add_picture';
            inputTitleAddPicture.id = 'text_title_add_picture';
            inputTitleAddPicture.style.width = '420px';
            inputTitleAddPicture.style.height = '51px';
            inputTitleAddPicture.style.marginTop = '10px';
            inputTitleAddPicture.style.marginBottom = '21px';
            inputTitleAddPicture.style.border = 'none';
            inputTitleAddPicture.style.boxShadow = '0px 4px 14px 0px rgba(0, 0, 0, 0.09)';
    
    
            //Label Catégorie
            let labelCategoryAddPicture = document.createElement('label');
            labelCategoryAddPicture.textContent = 'Catégorie'
            labelCategoryAddPicture.className = 'form_add_picture';
            labelCategoryAddPicture.for = 'category';
            labelCategoryAddPicture.style.fontWeight = 'Work Sans';
            labelCategoryAddPicture.style.fontWeight = '500';
            labelCategoryAddPicture.style.fontSize = '14px';
            labelCategoryAddPicture.style.color = '#3D3D3D';
    
            //Input Catégorie
            let inputCategoryAddPicture = document.createElement('select');
            inputCategoryAddPicture.className = 'form_add_picture';
            inputCategoryAddPicture.name = 'text_category_add_picture';
            inputCategoryAddPicture.id = 'text_category_add_picture';
            inputCategoryAddPicture.style.width = '420px';
            inputCategoryAddPicture.style.height = '51px';
            inputCategoryAddPicture.style.marginTop = '10px';
            inputCategoryAddPicture.style.border = 'none';
            inputCategoryAddPicture.style.boxShadow = '0px 4px 14px 0px rgba(0, 0, 0, 0.09)';

            //Option Catégorie
            let categoryValue = donneesCategorys;
            categoryValue.forEach ( category => {
                let option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                inputCategoryAddPicture.appendChild(option);
            })
    
            // Upload Image
    
            let fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.id = 'fileInput';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            
            let selectedFile = null;
    
            buttonAddPicture.addEventListener('click', function(){
                let verifyImgNoInformation = document.querySelector('#img_no_information');
                if (verifyImgNoInformation !== null){
                    verifyImgNoInformation.remove()
                }
                fileInput.click();
            })
    
            fileInput.addEventListener('change', function (){
                if (fileInput.files.length === 0) return;
    
                selectedFile = fileInput.files[0];
                iconAddPicture.remove();
                buttonAddPicture.remove();
                paragraphAddPicture.remove();
                let imgPreview = document.createElement('img');
                imgPreview.style.width = '129px';
                imgPreview.style.height = '169px';
    
                const reader = new FileReader();
                reader.onload = function (e) {
                    imgPreview.src = e.target.result;
                }
                //Encodage
                reader.readAsDataURL(selectedFile);
    
                divInsertPicture.appendChild(imgPreview);
                
                boutonModalTwo(button, selectedFile)
            });
            
            if (selectedFile === null){
                button.addEventListener('click', function(){
                    let verifyImgNoInformation = document.querySelector('#img_no_information');

                    if (verifyImgNoInformation !== null){
                        verifyImgNoInformation.remove()
                    }
                    let imgNoInformation = document.createElement('p');
                    imgNoInformation.id = 'img_no_information';
                    imgNoInformation.textContent = 'Veuillez ajouter une photo';
                    imgNoInformation.style.color = 'red';
                    divInsertPicture.appendChild(imgNoInformation);
                })
            }
            
            //Insertion
            let parent = document.querySelector('#modal');
            let divBarModal = document.querySelector('#div_bar_modal');
            parent.insertBefore(formAddPicture, divBarModal);
            parent.insertBefore(divInsertPicture, formAddPicture);
            divInsertPicture.appendChild(iconAddPicture);
            divInsertPicture.appendChild(buttonAddPicture);
            divInsertPicture.appendChild(paragraphAddPicture);
            formAddPicture.appendChild(divTitleCategory);
            formAddPicture.appendChild(labelTitleAddPicture);
            formAddPicture.appendChild(inputTitleAddPicture);
            formAddPicture.appendChild(labelCategoryAddPicture);
            formAddPicture.appendChild(inputCategoryAddPicture);
            formAddPicture.appendChild(fileInput);

}

function boutonModalTwo (button, selectedFile) { // Permet de récuperer les données rentrées par l'utilisateur sur la modale Ajout Photo et de les envoyer à postWork
    button.addEventListener('click', function (){
    titre = document.querySelector('#text_title_add_picture').value;
    category = document.querySelector('#text_category_add_picture').value;
    let formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('title', titre);
        formData.append('category', category);
    postWork(formData);
    });
   
}

async function postWork (formData) { // Envoie à l'api le travail qui viens d'etre créer dans la modale
    const token = sessionStorage.getItem('token');
    const requete = await fetch (url + 'works',{
        method : 'POST',
        headers : {
            Authorization : 'Bearer ' + token,
        },
        body : formData
    });
    if (requete.ok){
        let allModals = document.querySelectorAll('.all_modal')
        allModals.forEach(modal => modal.remove());
        await getWorks();
        displayWorks(donneesWorks);
    } else if ( requete.status === 400){
        let divInsertPicture = document.querySelector ('#div_Insert_Picture');
        divInsertPicture.remove();
        let formAddPicture = document.querySelector('#form_add_picture');
        formAddPicture.remove();
        alert('Veuillez Renseigner un titre');
        displayModalAddPicture();

    } else {
        alert('Erreur à l\'ajout du travail veuillez recharcher la page');
    }
}



function closeModal(close) { // Permet la fermeture de la modale
    close.addEventListener('click', function (){
        allModals = document.querySelectorAll('.all_modal')
        allModals.forEach(modal => modal.remove());
    }); 
}

// Demande API de suppression d'un travail 
async function deleteWork (workToBeDeleted){

    // Récupération du token de la session en cours
    const token = sessionStorage.getItem('token');

    // Insertion dans l'url de l'id du travail a supprimer
    const requete = await fetch (url + 'works/' + workToBeDeleted.id ,{
        method : 'DELETE',
        headers : {
            Authorization : 'Bearer ' + token
        },
    });
    if (requete.ok) {
        displayWorks(donneesWorks);
    } else if (requete.status === 401) {
        alert('Vous n\'avais pas les authorization nécessaires pour faire ceci');
    } else if (requete.status === 500) {
        alert('Erreur innatentue avec le serveur merci de réactuliser la page');
    }
}





