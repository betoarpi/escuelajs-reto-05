const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://rickandmortyapi.com/api/character/';
window.localStorage.clear();

const getData = api => {
  fetch(api)
    .then(response => response.json())
    .then(response => {
      const characters = response.results;
      const next = response.info.next;
      localStorage.setItem('next_fetch', next);
      let output = characters.map(character => {
        return `
      <article class="Card">
        <img src="${character.image}" />
        <h2>${character.name}<span>${character.species}</span></h2>
      </article>
    `
      }).join('');
      let newItem = document.createElement('section');
      newItem.classList.add('Items');
      newItem.innerHTML = output;
      $app.appendChild(newItem);
    })
    .catch(error => console.log(error));
}

const noMoreData = function () {
  const noDataItem = document.createElement('p');
  noDataItem.classList.add('No-Data');
  noDataItem.innerText = `Ya no hay más personajes...`;
  $app.appendChild(noDataItem);
};

const loadData = async () => {
  try {
    if (localStorage.getItem('next_fetch')) {
      await getData(localStorage.getItem('next_fetch'))
    } else if (localStorage.getItem('next_fetch') === "") {
      noMoreData();
      intersectionObserver.unobserve($observe);
    } else {
      getData(API);
    }
  }
  catch (error) {
    console.log(`Ha ocurrido un error: ${error}`)
  }
}

const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    loadData();
  }
}, {
  rootMargin: '0px 0px 100% 0px',
});

intersectionObserver.observe($observe);