import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const inputSearchEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputSearchEl.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  countryListEl.innerHTML = '';
  countryInfoEl.innerHTML = '';
  const formValue = e.target.value.trim();

  if (formValue === '') {
    countryListEl.innerHTML = '';
    countryInfoEl.innerHTML = '';
    return;
  }

  fetchCountries(formValue)
    .then(data => {
      if (data.length > 9) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (data.length > 1 && data.length < 10) {
        createCountryListMarkup(data);
      }
      if (data.length === 1) {
        createCountryInfoMarkup(data);
      }
    })
    .catch(err => {
      Notify.failure('Oops, there is no country with that name');
    });
}

function createCountryListMarkup(arr) {
  const markup = arr
    .map(
      ({ name, flags }) =>
        `<li class="country-item">
        <img class="flag" src="${flags.svg}" alt="flag">
         <h3>${name.official}</h3>
       </li>`
    )
    .join(' ');

  countryListEl.innerHTML = markup;
}

function createCountryInfoMarkup(arr) {
  const markup = arr
    .map(
      ({ name, capital, population, flags, languages }) =>
        `<li class="country-info">
          <img class="flag" src="${flags.svg}" alt="flag">
           <h3>${name.official}</h3>
           <h3>Capital: ${capital}</h3>
           <h3>Population: ${population}</h3>
           <h3>Languages: ${Object.values(languages)}</h3>
         </li>`
    )
    .join(' ');

  countryInfoEl.innerHTML = markup;
}
