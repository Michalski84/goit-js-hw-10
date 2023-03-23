import debounce from 'lodash/debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const fetchCountriesInput = document.querySelector('input');
const countryList = document.querySelector('.country-list');

fetchCountriesInput.addEventListener(
  'input',
  debounce(() => {
    const name = fetchCountriesInput.value.trim();
    if (name === '') {
      countryList.innerHTML = '';
      return;
    }
    fetchCountries(name)
      .then(countries => renderCountriesList(countries))
      .catch(error => console.log(error));
  }, 300)
);

function fetchCountries(name, limit = 10) {
  return fetch(
    `https://restcountries.com/v2/name/${name}?fields=name,capital,population,languages,flags,official`
  )
    .then(response => {
      if (!response.ok) {
        if (response.status === 404) {
          Notify.failure('Oops, there is no country with that name.');
        } else {
          throw new Error(response.status);
        }
      }
      return response.json();
    })
    .then(countries => {
      if (countries.length > 1) {
        if (countries.length > limit) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }
        return countries.slice(0, limit).map(country => {
          return {
            name: country.name,
            flag: country.flags.svg,
          };
        });
      } else {
        return countries;
      }
    })
    .catch(error => {
      console.log(error);
      Notify.failure('Oops, something went wrong. Please try again later.');
    });
}

function renderCountriesList(countries) {
  let markup;
  if (countries.length === 1) {
    const country = countries[0];
    const languages = country.languages
      .map(language => language.name)
      .join(', ');
    markup = `<li style="list-style-type: none;">
                <div style="display: flex; align-items: center;">
                  <img src="${country.flags.svg}" alt="${country.name} flag" style="max-width: 50px; max-height: 30px;">
                  <h1 style="margin-left: 10px;">${country.name}</h1>
                </div>
                <p><b>Capital</b>: ${country.capital}</p>
                <p><b>Population</b>: ${country.population}</p>
                <p><b>Languages</b>: ${languages}</p>
              </li>`;
  } else {
    const limitedCountries = countries.slice(0, 10);
    markup = limitedCountries
      .map(country => {
        return `<li style="list-style-type: none;">
                  <div style="display: flex; align-items: center;">
                    <img src="${country.flag}" alt="${country.name} flag" style="max-width: 50px; max-height: 30px;">
                    <h3 style="margin-left: 10px;">${country.name}</h3>
                  </div>
                </li>`;
      })
      .join('');
  }
  countryList.innerHTML = markup;
}
