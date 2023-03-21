const fetchCountriesInput = document.querySelector('input');
const countryList = document.querySelector('.country-list');

fetchCountriesInput.addEventListener('input', () => {
  const name = fetchCountriesInput.value;
  fetchCountries(name)
    .then(countries => renderCountriesList(countries))
    .catch(error => console.log(error));
});

function fetchCountries(name, limit = 10) {
  return fetch(
    `https://restcountries.com/v2/name/${name}?fields=name,capital,population,languages,flags,official`
  )
    .then(response => {
      if (!response.ok) throw new Error(response.status);
      return response.json();
    })
    .then(countries => {
      if (countries.length > 1) {
        return countries.map(country => {
          return {
            name: country.name,
            flag: country.flags.svg,
          };
        });
      } else {
        return countries;
      }
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
    const limitedCountries = countries.slice(0, 10); // wybierz maksymalnie 10 krajów
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

fetchCountries('polska')
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });

// const fetchUsersBtn = document.querySelector('.btn');
// const userList = document.querySelector('.user-list');

// fetchUsersBtn.addEventListener('click', () => {
//   fetchUsers()
//     .then(users => renderUserList(users))
//     .catch(error => console.log(error));
// });

// function fetchUsers() {
//   return fetch('https://jsonplaceholder.typicode.com/users').then(response => {
//     if (!response.ok) {
//       throw new Error(response.status);
//     }
//     return response.json();
//   });
// }

// function renderUserList(users) {
//   const markup = users
//     .map(user => {
//       return `<li>
//           <p><b>Name</b>: ${user.name}</p>
//           <p><b>Email</b>: ${user.email}</p>
//           <p><b>Company</b>: ${user.company.name}</p>
//         </li>`;
//     })
//     .join('');
//   userList.innerHTML = markup;
// }
