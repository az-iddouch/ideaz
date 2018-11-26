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
