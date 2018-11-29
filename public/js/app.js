import '../scss/main.scss';

const navLinks = document.querySelectorAll('.navigation-list__link');

navLinks.forEach(link => {
  link.addEventListener('mouseover', function(e) {
    console.log('hoverrrr');
    console.log(this.previousSibling);
    this.previousElementSibling.style.backgroundColor = '#fff';
  });
  link.addEventListener('mouseout', function(e) {
    console.log('hoverrrr');
    console.log(this.previousSibling);
    this.previousElementSibling.style.backgroundColor = 'transparent';
  });
});

const dismissErrors = document.querySelectorAll('.error__dismiss');
dismissErrors.forEach(x =>
  x.addEventListener('click', function(e) {
    e.target.parentElement.remove();
  })
);
