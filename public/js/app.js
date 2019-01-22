const moment = require('moment');
import '../scss/main.scss';

const navLinks = document.querySelectorAll('.navigation-list__link');

navLinks.forEach(link => {
  link.addEventListener('mouseover', function(e) {
    this.previousElementSibling.style.backgroundColor = '#fff';
  });
  link.addEventListener('mouseout', function(e) {
    this.previousElementSibling.style.backgroundColor = 'transparent';
  });
});

// dismiss errors
const dismissErrors = document.querySelectorAll('.flash__dismiss');
dismissErrors.forEach(x =>
  x.addEventListener('click', function(e) {
    e.target.parentElement.remove();
  })
);

// delete idea
const deleteIcons = document.querySelectorAll('.ideas__idea-delete-icon');
deleteIcons.forEach(icon =>
  icon.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector('#delete-idea-form').submit();
  })
);

// fade flash messages after 1.5s
const flash = document.querySelector('.flash');
if (flash) {
  setTimeout(() => {
    flash.style.opacity = 0;
  }, 3000);
}

// handling dates
const dates = document.querySelectorAll('.ideas__idea-date');
if (dates) {
  dates.forEach(date => {
    // to fix a moment js error
    const newDate = new Date(date.textContent);
    date.textContent = moment(newDate.toISOString()).format('D MMM, YYYY');

    // console.log(datetext);
  });
}

// add categorie
const addCategorieLink = document.querySelector('.categories__add');
addCategorieLink.addEventListener('click', e => {
  e.preventDefault();
  e.stopPropagation();
  // console.log(e.target.previousElementSibling);
  e.target.previousElementSibling.classList.add('categories__add-form--active');
});

// if clicked anywhere
const addForm = document.querySelector('.categories__add-form');
window.addEventListener('click', e => {
  if ([...addForm.classList].includes('categories__add-form--active')) {
    addForm.classList.remove('categories__add-form--active');
  }
});

addForm.addEventListener('click', e => {
  e.stopPropagation();
});
