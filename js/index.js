const country = document.querySelector(`#country`);
const city = document.querySelector(`#city`);
const display = document.querySelector(`#display`);
const btn = document.querySelector(`#btn`);
let array = [];

btn.addEventListener(`click`, async function () {
    if (!validateInputs(country.value, city.value)) {
        return;
    }
    const apiKey = '7ecec48b68b14a4180784425242301';
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${country.value.trim()},${city.value.trim()}`);
    const data = await response.json();

    addElementToHtml(data);
    array.push(data);
    cleanInputs();
    saveInLocalStorage();
})

function validateInputs(countryValue, cityValue) {
    if (!countryValue || !cityValue) {
        displayErrorAlert(`Please Write down the name of the country and city`);
        return false;
    }
    return true;
}

function displayErrorAlert(message) {
    const errorMessage = document.querySelector(`#alert`);
    if (message) {
        errorMessage.textContent = message;
        errorMessage.style.display = `block`;

        setTimeout(() => {
            errorMessage.textContent = "";
            errorMessage.style.display = `none`;
        }, 5000);
    } else {
        errorMessage.textContent = "";
        errorMessage.style.display = `none`;
    }
}

function cleanInputs() {
    country.value = "";
    city.value = "";
}

function saveInLocalStorage() {
    localStorage.setItem(`save`, JSON.stringify(array));
}

function addElementToHtml(data) {
    const div = document.createElement(`div`);
    div.classList.add(`border-bottom`, `pb-3`, `pt-3`)
    div.innerHTML = `<div>${data.location.name} ${data.location.country} ${data.location.region}</div>
    <div>${data.current.temp_c}</div>
    <div>${data.current.condition.text} <img src="${data.current.condition.icon}"> <span class="d-none">${data.current.condition.code}</span></div>
    <div>${data.current.last_updated}</div>`;
    favoriteButton(div);
    createDeleteButton(div);
    display.appendChild(div);
}

function favoriteButton(div) {
    const favoriteBtn = document.createElement(`button`);
    favoriteBtn.innerHTML = `<img src="https://api.iconify.design/fe:heart.svg" style="width: 35px" />`;
    favoriteBtn.classList.add(`favoriteButton`);
    div.appendChild(favoriteBtn);

    favoriteBtn.addEventListener(`click`, function () {
        userFavorite(div);
    })
}

function userFavorite(div) {
    const index = Array.from(display.children).indexOf(div);
    if (index !== -1) {
        const removedItem = array.splice(index, 1)[0];
        array.unshift(removedItem);
        saveInLocalStorage();

        display.innerHTML = '';

        array.forEach(data => {
            const newDiv = document.createElement('div');
            newDiv.classList.add('border-bottom', 'pb-3', 'pt-3');
            newDiv.innerHTML = `<div>${data.location.name} ${data.location.country} ${data.location.region}</div>
          <div>${data.current.temp_c}</div>
          <div>${data.current.condition.text} <img src="${data.current.condition.icon}"> <span class="d-none">${data.current.condition.code}</span></div>
          <div>${data.current.last_updated}</div>`;
            favoriteButton(newDiv);
            createDeleteButton(newDiv);
            display.appendChild(newDiv);
        });
    }
}

function createDeleteButton(div) {
    const deleteButton = document.createElement(`button`);
    deleteButton.innerHTML = `<img src="https://api.iconify.design/fe:close.svg" style="width: 35px" />`;
    deleteButton.classList.add(`deleteButton`);
    div.appendChild(deleteButton);

    deleteButton.addEventListener(`click`, function () {
        deleteElementFromHtml(div);
    })
}

function deleteElementFromHtml(div) {
    const index = Array.from(display.children).indexOf(div);
    if (index !== -1) {
        array.splice(index, 1);
        saveInLocalStorage();
        div.remove();
    }
}

function getFromLocalStorage() {
    array = JSON.parse(localStorage.getItem(`save`)) || [];
}

(function () {
    getFromLocalStorage();
    array.forEach(element => {
        addElementToHtml(element);
    });
})();