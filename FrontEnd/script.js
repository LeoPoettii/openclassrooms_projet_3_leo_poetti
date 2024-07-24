// Variable général 

let loginEventListener = document.getElementById('login-form');

// Partie Fetch

// Ne pas oublier d'utiliser les asynchrones async & await
// 1 : Mettre dans une variable l'url sans endpoint de l'api 
const url = 'http://localhost:5678/api/'

//Partie getWorks : Récupération des travaux 

// 1 : Création de la fonction getWorks
// 2 : Appeller fetch et l'inserer dans la variable requete
// 3 : Mettre en parametre url + objet avec method : get;
// 4 : Vérifier que la requete est ok
// 5 : Transmettre le contenu de donneesWorks à displayWorks pour afficher les travaux
// 6 : Réaliser un return de donneesWorks qui sera utiliser la fonction categoriesEventListener() 

 async function getWorks() {
    const requete = await fetch (url + 'works', {
        method: 'GET'
    });

    if (!requete.ok) {

        alert('Un problème est survenu sur la récupération des travaux.');

    } else {
        let donneesWorks = await requete.json();
        displayWorks(donneesWorks);
        return donneesWorks;
    }
}

// Partie getCategories : Filter les travaux par catégorie

// 1 : Création de la fonction getCategory
// 2 : Appeller fetch et l'inserer dans la variable requete
// 3 : Mettre en parametre url + objet avec method : get;
// 4 : Vérifier que la requete est ok
// 5 : Récuperer les donnees de l'api dans une variable 
// 6 : Appeller la fonction displayCategory 

async function getCategories () {
    const requete = await fetch (url + 'categories', {
        method: 'GET'
    });

    if (!requete.ok){
        alert('Un problème est survenu sur la récupération des catégories.')
    } else {
        displayCategory();
        
    }
}

// Partie postUsersLogin : Établir la connexion d'un utilisateur et la gestion de son token


// 1 : Création de la fonction postUserLogin avec parametre emailPassword qui donnera les identifiant rentré par l'utilisateur
// 2 : Appeler fetch et l'inserer dans la variable requete
// 3 : Mettre en parametre method POST, le header attendu et l'email et password dans le body de la requete
// 4 : Vérifier les differents status
// 5 :  Appeller la bonne fonction par rapport au status de requete

async function postUsersLogin (emailPassword) {
    const requete = await fetch (url + 'users/login',{
        method : 'POST',
        headers : {
            'Content-Type': 'application/json',
        },
        body : JSON.stringify (emailPassword)
    });
    if (requete.ok) {
        reponse = await requete.json();
        requeteOkTrue(reponse);

    } else if (requete.status === 404) {
        incorrectInformation ();
    } else if (requete.status === 401) {
        incorrectPassword();
    } else {
        alert("Erreur inattendu merci de rafraichir la page");
    }
}

//Fin de la partie fetch
//------------------------------------------------------------------------------------------------------------------------------------

// Partie sur la modification visuel du DOM

// Partie displayWorks : Afficher chaqu'un des travaux

// 1 : Faire un querySelector de la class gallery pour pouvoir réaliser un appendchild dessus
// 2 : Réaliser une boucle for pour ajouter chaque travaux
// 3 : Créer une balise <figure>
// 4 : Utiliser innerHTML à la balise <figure>
// 5 : Chaque innerHtml est unique grace au path de chaqu'un des travaux
// 6 : Inserer chaque travaux sur la page html

function displayWorks (donneesWorks) {
    let galleryDiv = document.querySelector('.gallery');

    for ( let i = 0 ; i < (donneesWorks.length); i++){

     let figure = document.createElement('figure');
     figure.innerHTML = '<img src="' + donneesWorks[i].imageUrl + '" alt="' +  donneesWorks[i].title +'"><figcaption>' + donneesWorks[i].title + '</figcaption>';
     galleryDiv.appendChild(figure);

    }
}

// Partie displayCategory : Afficher les différentes catégories

// 1 : Faire un querySelector de l'id projets pour pouvoir réaliser un appendchild dessus
// 2 : Création d'une liste avec chaque catégories
// 3 : Créer une div qui acceuillera l'ensemble des catégories
// 4 : Inserez cette div en dessous de Mes Projets
// 5 : Gerer le design
// 6 : Réaliser une boucle for pour chaque élément de la liste ainsi que leur design
// 7 : Inserer chaqu'une des catégories à l'intérieur de la div créer

function displayCategory () {
    let projets = document.querySelector('#projets');
    let listeCategories = ['Tous', 'Objets', 'Appartements', 'Hotels & restaurants'];
    let divCategories = document.createElement('div');
    projets.insertAdjacentElement('afterend', divCategories);
    divCategories.style.display = 'flex';
    divCategories.style.justifyContent = 'center';
    divCategories.style.gap = '15px';

    for ( let i = 0; i < listeCategories.length; i++){
        let category = document.createElement('button');
        category.textContent = listeCategories[i];
        category.className = 'category_project'
        category.id = listeCategories[i].substring(0, 6);
        category.style.fontSize = '16px';
        category.style.fontWeight = '700';
        category.style.fontFamily = 'Syne';
        category.style.backgroundColor = 'white';
        category.style.color = '#1D6154';
        category.style.border = 'solid 1px #1D6154';
        category.style.borderRadius = '60px';
        category.style.padding = '10px 20px 10px 20px';
        category.style.marginBottom = '50px';
        divCategories.appendChild(category);
    }
    categoriesEventListener();
}

// Partie displayCategorySelect : Modification de la partie visuel en fonction de la catégorie choisi

// 1 : Création de la fonction displayCategorySelect avec le parametre categorySelect qui permettra d'identifier le bouton choisi
// 2 : Réaliser un querySelector sur chacune des 4 catégories + sur la class de l'ensemble de celles-ci
// 3 : Évènements sur chacun des boutons afin de reinitialisé leur design (comme si il n'avais pas été sélectionné)
// 4 : Conditions switch permet grâce au parametre categorySelect de savoir sur quel bouton l'utilisateur à cliqué
// 5 : Modifie le css du bouton selectionné comme sur la maquette lorsque celui-ci est sélectionner
// 6 : Gestion des erreurs

function displayCategorySelect (categorySelect) {

    let categoryProject = document.querySelectorAll('.category_project');
    let tous = document.querySelector('#Tous');
    let objets = document.querySelector('#Objets');
    let appartements = document.querySelector('#Appart');
    let hotelsRestaurants = document.querySelector('#Hotels');
    
    categoryProject.forEach(button => {
        button.style.backgroundColor = 'white';
        button.style.color = '#1D6154';
    });

    switch (categorySelect) {
        case 'tous' :
            tous.style.backgroundColor = '#1D6154';
            tous.style.color = 'white';
            break;
        case 'objets' : 
            objets.style.backgroundColor = '#1D6154';
            objets.style.color = 'white';
            break;
        case 'appartements' :
            appartements.style.backgroundColor = '#1D6154';
            appartements.style.color = 'white';
            break;
        case 'hotelsRestaurants' :
            hotelsRestaurants.style.backgroundColor = '#1D6154';
            hotelsRestaurants.style.color = 'white';
            break;
        default :
            alert('Une erreur est survenue sur la selection d\'une catégories, merci de recharger la page.');
    }
}

//Fin de la partie sur la modification visuel du DOM
//------------------------------------------------------------------------------------------------------------------------------------

// Partie sur les évènements

// Partie categoriesEventListener : Gestion des click des différentes catégories

// 1 : Création de la fonction categoriesEventListener sous forme d'asynchrones car nous attentons une prommesse de la fonction getWorks
// 2 : Stocker les données de la fonction getWorks dans une variable afin de les passer en parametre lors de l'appel de la fonction filterCategories
// 3 : Réaliser un querySelector sur chacune des 4 catégories
// 4 : Initialiser la catégories tous de façon visuel
// 5 : Créer un évènement au click pour chacune des 4 catégories
// 6 : Initialiser chacun des boutons avec deux Variables afin de les rendres unique lors des 2 prochaines fonctions
// 7 : Appeler la fonction displayCategorySelect avec comme parametre la variable categorySelect
// 8 : Appeler la fonction filterCategories avec comme parametre les variables categoryName et donneesWorks

async function categoriesEventListener () {

    const donneesWorks = await getWorks();

    let tous = document.querySelector('#Tous');
    let objets = document.querySelector('#Objets');
    let appartements = document.querySelector('#Appart');
    let hotelsRestaurants = document.querySelector('#Hotels');

    tous.style.backgroundColor = '#1D6154';
    tous.style.color = 'white';

    tous.addEventListener('click', () => {
        let categorySelect = 'tous'
        let categoryName = 'tous'
        displayCategorySelect(categorySelect);
        filterCategories(categoryName, donneesWorks);
    });

    objets.addEventListener('click', () => {
        let categorySelect = 'objets'
        let categoryName = 'Objets'
        displayCategorySelect(categorySelect);
        filterCategories(categoryName, donneesWorks);
    });

    appartements.addEventListener('click', () => {
        let categorySelect = 'appartements'
        let categoryName = 'Appartements'
        displayCategorySelect(categorySelect);
        filterCategories(categoryName, donneesWorks);
    });

    hotelsRestaurants.addEventListener('click', () => {
        let categorySelect = 'hotelsRestaurants'
        let categoryName = 'Hotels & restaurants'
        displayCategorySelect(categorySelect);
        filterCategories(categoryName, donneesWorks);
    });
    
    
}

//Fin partie sur les évènements
//------------------------------------------------------------------------------------------------------------------------------------


// Partie Filtrage

//Partie filterCategories : Permet de filtrer les projets

// 1 : Création de la fonction filterCategories avec les parametres categoryName pour savoir quelle catégorie choisir lors du filtrage et donneesWorks qui contient l'ensembles des travaux
// 2 : Suppression de l'ensemble des travaux pour éviter les doublons ou les erreurs de catégories
// 3 : Boucle for sur donneesWorks afin de réaliser au cas par cas si le projet doit etre afficher ou non
// 4 : Condition If en premier lieu sur 'tous' qui correspond à l'affichage de tout les projets (doit etre réaliser en premier car ne corresponds pas à une catégorie a part entière)
// 5 : Comparaison de la catégorie selectionné avec le category.name de l'api de chaque travail.

function filterCategories (categoryName, donneesWorks) {
    galleryDiv = document.querySelector('.gallery');
    galleryDiv.innerHTML = '';

    for (i = 0; i < (donneesWorks.length); i++){
        
        if (categoryName === 'tous'){
            let figure = document.createElement('figure');
            figure.innerHTML = '<img src="' + donneesWorks[i].imageUrl + '" alt="' +  donneesWorks[i].title +'"><figcaption>' + donneesWorks[i].title + '</figcaption>';
            galleryDiv.appendChild(figure);
        } else if (categoryName === donneesWorks[i].category.name){
            let figure = document.createElement('figure');
            figure.innerHTML = '<img src="' + donneesWorks[i].imageUrl + '" alt="' +  donneesWorks[i].title +'"><figcaption>' + donneesWorks[i].title + '</figcaption>';
            galleryDiv.appendChild(figure);
        }
    }
}

//Fin partie sur le filtrage
//------------------------------------------------------------------------------------------------------------------------------------

// Partie page Login

// Partie loginEventListener : Traitement avant envoie des données pour l'api post users/login

// 1 : Mettre une condition qui vérifie que l'utilisateur est sur la page login pour éviter les erreurs
// 2 : Créer l'évènement loginEventListener sous forme de submit
// 3 : Appeler preventdefault pour empêcher la propagation des évènements
// 4 : Appel de la fonction removeInccorrectNotif reinitialiser le message d'erreur afin d'éviter la duplication de celui-ci
// 5 : Récupération des valeurs Email et Mot de passe entré par l'utilisateur
// 6 : Création d'un objet javascript afin de stocker les valeurs entrées par l'utilisateur
// 7 : Appeler de la fonction postUsersLogin avec comme parametre emailPassword faisant référence à l'objet créé

if (loginEventListener != null){
    loginEventListener.addEventListener('submit', function (e){
        e.preventDefault();
        removeIncorrectNotif ()
            
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
            
        let emailPassword = {
                    email : email,
                    password : password
                }
            
                postUsersLogin(emailPassword)
        });
}



// Partie réponse en fonction du status code

//removeIncorrectNotif

// 1 : Création de la fonction removeIncorrectNotif
// 2 : Réaliser un querySelector de errorMessage présent dans les fonctions incorrectInformation & incorrectPassword
// 3 : Vérifier que celui-ci existe
// 4 : Si il existe supprimer le message d'erreur

function removeIncorrectNotif () {
    let errorMessage = document.querySelector('#error_message');

    if (errorMessage !== null) {

       let email = document.querySelector('#email');
        let password = document.querySelector('#password');
        email.style.border = 'none'
        password.style.border = 'none'
        errorMessage.remove();
    }
}

// incorrectInformation : Status 404

// 1 : Création de la fonction incorrectInformation
// 2 : Réaliser un querySelector de id email et password et password-fold
// 3 : Mettre une bordure rouge sur l'input avec l'id email et password
// 4 : Creer un element avec le message erreur email et password
// 5 : lui ajouter un id afin de pouvoir le selectionner dans la fonction removeIncorrectNotif
// 6 : Lui ajouter le message d'erreur et du style
// 7 : Inserer le message au dessus de passwordFold

function incorrectInformation () {
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
}

// incorrectPassword : Status 401

// 1 : Copier coller la fonction incorrectInformation
// 2 : Modifier le message d'erreur et le querySelector de e-mail

function incorrectPassword () {
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
}

// requeteOkTrue : Status 200

function requeteOkTrue (reponse) {
    userId = reponse.userId
    token = reponse.token;
    window.location.href = 'http://127.0.0.1:5500/FrontEnd/index.html'
}



// Appel des fonctions 
getCategories();