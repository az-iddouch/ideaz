const moment = require('moment');
const typeAhead = require('./typeAhead');
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
const deleteIcons = document.querySelectorAll('.idea__delete-link');
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
if (addCategorieLink) {
  addCategorieLink.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    // console.log(e.target.previousElementSibling);
    e.target.previousElementSibling.classList.add('categories__add-form--active');
  });
}

// if clicked anywhere
const addForm = document.querySelector('.categories__add-form');
if (addForm) {
  window.addEventListener('click', e => {
    if ([...addForm.classList].includes('categories__add-form--active')) {
      addForm.classList.remove('categories__add-form--active');
    }
  });

  addForm.addEventListener('click', e => {
    e.stopPropagation();
  });
}

// add categorie

// to prevent the form from submitting when pressing Enter
addForm &&
  addForm.addEventListener('keydown', e => {
    if (e.keyCode == 13) {
      e.preventDefault();
      return false;
    }
  });

const catAddInput = document.querySelector('.categories__add-input');
catAddInput &&
  catAddInput.addEventListener('keydown', async e => {
    // e.preventDefault();
    if (e.keyCode == 13) {
      const rawResponse = await fetch('/api/categories/add', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: e.target.value })
      });
      const content = await rawResponse.json();
      const categorieNode = `<li class="categories__list-item">
      <div class="categories__list-item-circle" style="background-color:${
        content.color
      };"></div><a href="/categories/${content._id}" class="categories__list-item-link">${
        content.text
      }</a>
      <a href="#" data-id="${content._id}" class="categories__list-item-remove">X</a>
      </li>`;
      e.target.value = '';
      if (!content.error) {
        e.target.parentElement.previousElementSibling.insertAdjacentHTML(
          'beforeend',
          categorieNode
        );
        // update categories nodes to include the added node
        categories = document.querySelectorAll('.categories__list-item');
        if ([...e.target.parentElement.classList].includes('categories__add-form--active')) {
          addForm.classList.remove('categories__add-form--active');
        }
      } else {
        // hande none subscribed users adding more than 5 categories
        const err = `<div class="sidebar-error">${content.error}</div>`;
        e.target.parentElement.nextElementSibling.insertAdjacentHTML('afterend', err);
        // delete error after 2.5seconds
        setTimeout(function() {
          document.querySelector('.sidebar-error').remove();
        }, 2500);
      }
    }
  });

// delete an categorie
let categories = document.querySelectorAll('.categories__list-item');
categories.forEach(el => {
  el.addEventListener('mouseenter', e => {
    e.target.children[2].style.opacity = 1;
  });
  el.addEventListener('mouseleave', e => {
    e.target.children[2].style.opacity = 0;
  });
});

// add event listener to every delete link in categories
// and delete when clicked
const categoriesDelbtn = document.querySelectorAll('.categories__list-item-remove');
categoriesDelbtn.forEach(el => {
  el.addEventListener('click', async e => {
    e.preventDefault();
    e.stopPropagation();
    const req = await fetch('/api/categories/delete', {
      method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: e.target.dataset.id }) // body data type must match "Content-Type" header
    });
    const res = await req.json(); // parses response to JSON
    // remove categorie from DOM when deleted
    e.target.parentElement.remove();
    console.log(res);
  });
});

// Search ideas
const search = document.querySelector('.search');
typeAhead(search);
