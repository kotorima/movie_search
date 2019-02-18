let inputValue;
let mainSelector = document.querySelector('main');
let divSelector = document.querySelector('.main');

function getValue() {
    inputValue = document.querySelector('input').value;
    search();
}

document.getElementById('search').addEventListener('click', function () {
    if (inputValue == null) {
        getValue();
    } else {
        inputValue = null;
        mainSelector.innerHTML = "";
        getValue();
    }
});

const search = async () => {
    try {
        let response = await fetch('http://www.omdbapi.com/?s=' + inputValue + '&apikey=d5677312');
        let jsonSearch = await response.json();
        jsonSearch.Search.forEach(function (item) {
            let favClass = '';
            if (localStorage.getItem(item.Title) == 'true') {
                favClass = 'favYellow';
            }
            mainSelector.innerHTML += ('<div><div id="' + item.Title + '" class="favouriteItem ' + favClass + '">&#9733;</div>\
            <figure><img src="' + item.Poster + '" alt="' + item.Title + '">\
            <figcaption><a>'+ item.Title + '</a><p>' + item.Year + '</p></figcaption></figure></div>');
        });

        let titels = document.querySelectorAll('a');
        let filmName;
        titels.forEach(function (element) {
            element.addEventListener('click', function () {
                if (filmName == null) {
                    filmName = this.innerText;
                    const show = async () => {
                        try {
                            let answer = await fetch('http://www.omdbapi.com/?t=' + filmName + '&apikey=d5677312');
                            let jsonTitle = await answer.json();
                            mainSelector.style.display = "none";
                            divSelector.style.display = "flex";
                            let favClass;
                            if (localStorage.getItem(jsonTitle.Title) == 'true') {
                                favClass = 'favYellow';
                            }
                            divSelector.innerHTML += ('<button id="back">BACK</button>\
                                <div><div id="'+ jsonTitle.Title + '" class="favouriteItem showItem ' + favClass + '">&#9733;</div>\
                                <figure class="show">\
                                <img src="' + jsonTitle.Poster + '"  alt="' + jsonTitle.Title + '">\
                                <figcaption><h1>'+ jsonTitle.Title + '</h1>\
                                <p><span>Rating: </span>'+ jsonTitle.imdbRating + '</p>\
                                <p><span>Released: </span>'+ jsonTitle.Released + '</p>\
                                <p><span>Country: </span>'+ jsonTitle.Country + '</p>\
                                <p><span>Director: </span>'+ jsonTitle.Director + '</p>\
                                <p><span>Production: </span>'+ jsonTitle.Production + '</p>\
                                <p><span>Runtime: </span>'+ jsonTitle.Runtime + '</p>\
                                <p><span>Actors: </span>'+ jsonTitle.Actors + '</p>\
                                <p><span>Plot: </span>'+ jsonTitle.Plot + '</p></figcaption></figure></div>');
                            document.querySelector('#back').addEventListener('click', function () {
                                divSelector.style.display = 'none';
                                mainSelector.style.display = 'flex';
                                waitForLoad = true;
                            });
                            addFavourite();
                        }
                        catch (error) {
                            console.log(error);
                        }
                    }
                    show();
                }
                else {
                    filmName = null;
                    divSelector.innerHTML = "";
                }
            });
        });
    } catch (error) {
        mainSelector.innerHTML = "";
        mainSelector.innerHTML += "<h2>Oops, no movie by that name was found</h2>";

    }
    addFavourite();
}

function addFavourite() {
    let favouriteItem = document.querySelectorAll('.favouriteItem');
    favouriteItem.forEach(function (element) {
        element.addEventListener('click', function () {
            let movieName = this.getAttribute('id');
            if (localStorage.getItem(movieName) == null) {
                localStorage.setItem(movieName, true);
                this.classList.add('favYellow');
            }
            else {
                localStorage.removeItem(movieName);
                this.classList.remove('favYellow');
            }
        });
    });
}