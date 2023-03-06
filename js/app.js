document.addEventListener('DOMContentLoaded', function () {

    const theme = localStorage.getItem('theme')
    if (theme) {
        document.querySelector('body').classList.add(theme)
    }
    document.querySelectorAll('.theme-switch').forEach(e => {
        e.addEventListener('click', function () {
            const theme = this.dataset.theme
            const classList = document.querySelector('body').classList
            classList.remove('dark')
            classList.remove('light')
            classList.add(theme)
            localStorage.setItem('theme', theme)
        })
    })
    document.querySelector('#search').addEventListener('keyup', function (e) {
        if (e.code === 'Enter' || e.code === 'NumpadEnter')
            searchCountry()
    })
    document.querySelector('#region').addEventListener('change', function () {
        searchCountry()
    })
    searchCountry()
})
function fetchCountry(country) {
    document.getElementById('loader').classList.add('show-loader')
    const mainUrl = 'https://restcountries.com/v3.1'
    const url = country ? `${mainUrl}/name/${country}` : `${mainUrl}/all`

    fetch(url)
        .then((response) => response.json())
        .then((response) => {
            hideLoader()
            onSuccess(response)
        })
        .catch((err) => {
            hideLoader()
            console.error(err)
        })
}

function hideLoader() {
    document.getElementById('loader').classList.remove('show-loader')
}

function searchCountry() {
    const country = document.querySelector('#search').value
    document.getElementById('card').innerHTML = ''
    fetchCountry(country)
}

function onSuccess(countries) {
    const region = document.getElementById('region').value
    if (region) {
        countries = countries.filter((elem) => region === elem.region)
    }
    countries
        .sort(sortCountry)
        .forEach(country => addCountry(country))
}

function addCountry(country) {
    const capital = country.capital?.length && country.capital[0] || ''
    const html = `
    <div id="card-${country.cca2}" class="country">
        <img class="flag" src="${country.flags.png}" alt="flag">
        <div class="name">
            <p class="country-name">${country.name.common}</p>
            <p class="country-info">Population: <span class="font">${country.population.toLocaleString()}</span></p>
            <p class="country-info">Region: <span class="font">${country.region}</span></p>
            <p class="country-info">Capital: <span class="font">${capital}</span></p>
        </div>
    </div>
    `
    document.getElementById('card').innerHTML = document.getElementById('card').innerHTML + html
}
function sortCountry(i, j) {
    if (i.name.common < j.name.common) {
        return -1
    }
    if (i.name.common > j.name.common) {
        return 1
    }
    return 0
}


