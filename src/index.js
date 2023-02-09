import './css/styles.css';
import API from './fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';


const DEBOUNCE_DELAY = 300;
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const form = document.getElementById('search-box');

form.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  let searchQuery = e.target.value.trim();

  cleanMarkup(countryList);
  cleanMarkup(countryInfo);

  if (searchQuery === "") {
    Notiflix.Notify.failure('Please enter something!');
    return;
  }

    API.fetchCountries(searchQuery)
      .then(data => {
        const markupForListOCountries = createMarkupForListOCountries(data);
        const markupForOneCountry = createMarkupForOneCountry(data);

        if (data.length > 10) {
          Notiflix.Notify.warning(
            'Too many matches found. Please enter a more specific name'
          );
        } else if (data.length >= 2 && data.length < 10) {
          addMarkup(countryList, markupForListOCountries);
        } else addMarkup(countryInfo, markupForOneCountry);
      })
      .catch(error =>
        Notiflix.Notify.failure('Oops, there is no country with that name')
      );
}

function createMarkupForOneCountry(data) {
  return data
    .map(({ name, capital, population, flags, languages }) => {
      return `
            <div class="country">
            <h2 class="country-card-title"> <img src="${
              flags.svg
            }" alt="" width="70" height="50"> ${name.official}</h2>
            <p>Capital: ${capital}</p>
            <p>Population: ${population}</p>
            <p>Languages: ${Object.values(languages)}</p>
            </div>
            `;
    })
    .join('');
}

function createMarkupForListOCountries(data) {
  return data
    .map(({ name, flags }) => {
      return `
            <div class="country-card">
            <img src="${flags.svg}" alt="" width="50" height="30"> <p>${name.official}</p>
            </div>
            `;
    })
    .join('');
}

function addMarkup(element, markup) {
  element.insertAdjacentHTML('beforeend', markup);
}

function cleanMarkup(element) {
  return (element.innerHTML = '');
}
