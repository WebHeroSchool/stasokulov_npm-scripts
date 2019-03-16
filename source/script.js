function goBurger() {
        let burgerMenu = document.querySelector('.menu-nav__burger-menu'); //Выпадающее меню
        let body = document.querySelector('body'); //Все окно

    function showMenu() {
        burgerMenu.classList.remove('invis');
        burger.classList.add('menu-nav__item-burger_active');//Бургер становится крестом
        
        setTimeout( () => {
           body.addEventListener('click', removeMenu);
        }, 0);
        burger.removeEventListener('click', goBurger);
    }

    function removeMenu() {
        burgerMenu.classList.add('invis');
        burger.classList.remove('menu-nav__item-burger_active'); //Крест становится бургером
        body.removeEventListener('click', removeMenu);
        burger.addEventListener('click', goBurger); //Бургер снова получил слушатель клика
    }

    showMenu();
}

let burger = document.querySelector('.menu-nav__item-burger');
burger.addEventListener('click', goBurger);
