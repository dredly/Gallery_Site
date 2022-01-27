/* Script to add functionality to the navbar hamburger menu */

const burger = document.querySelector('#burger');
const navmenu = document.querySelector('#navmenu');

burger.addEventListener('click', () => {
    navmenu.classList.toggle('is-active');
})
