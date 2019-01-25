const DOMPurify = require('dompurify');
function searchResultsHTML(ideas) {
  if (!ideas) return;
  return ideas
    .map(idea => {
      return `
      <a href="/idea/${idea._id}" class="search__result">
        <strong>${idea.title}</strong>
      </a>
    `;
    })
    .join('');
}

function typeAhead(search) {
  if (!search) return;
  const searchInput = search.querySelector('input[name="search"]');
  const searchResults = search.querySelector('.search__results');
  searchInput.addEventListener('input', async function() {
    try {
      // if there's no results, quit
      if (!this.value) {
        searchResults.style.display = 'none';
        return;
      }
      // show search results
      searchResults.style.display = 'flex';

      const req = await fetch(`/api/search?q=${this.value}`);
      const res = await req.json();
      if (res.length) {
        searchResults.innerHTML = DOMPurify.sanitize(searchResultsHTML(res));
        return;
      }

      // tell them nothing came back
      searchResults.innerHTML = DOMPurify.sanitize(
        `<div class="search__result">No results for: ${this.value} found !</div>`
      );
    } catch (err) {
      console.log(err);
    }
  });

  // handle keyboard inputs
  searchInput.addEventListener('keyup', e => {
    // if they aren't pressing up, down or enter who cares !
    if (![38, 40, 13].includes(e.keyCode)) {
      return;
    }
    const activeClass = 'search__result--active';
    const current = search.querySelector(`.${activeClass}`);
    const items = search.querySelectorAll('.search__result');
    let next;
    if (e.keyCode === 40 && current) {
      next = current.nextElementSibling || items[0];
    } else if (e.keyCode === 40) {
      next = items[0];
    } else if (e.keyCode === 38 && current) {
      next = current.previousElementSibling || items[items.length - 1];
    } else if (e.keyCode === 38) {
      next = items[items.length - 1];
    } else if (e.keyCode === 13 && current.href) {
      window.location = current.href;
      return;
    }

    // if we have a current , remove the class from it
    if (current) {
      current.classList.remove(activeClass);
    }
    next.classList.add(activeClass);
  });
}

module.exports = typeAhead;
