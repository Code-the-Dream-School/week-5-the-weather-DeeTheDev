//Ajax call to Weather API
let section = document.getElementById("info");
let input = document.getElementsByTagName("input");
let keyID = "1628f5269e158133091d762a6f98245b";

// fetch JSON from API function
async function getJSON(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        throw error;
    }
}

async function getCurrentWeather(url) {
    const weatherJSON = await getJSON(url);

    const weathers = [weatherJSON].map(async (allData) => {
        const weatherDATA = allData;
        const lat = allData.coord.lat;
        const lon = allData.coord.lon;
        let oneCallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${keyID}`;

        const oneCallJSON = await getJSON(oneCallURL);

        return { ...oneCallJSON, weatherDATA };
    });
    return Promise.all(weathers);
}

function generateHTML(data) {
    data.map((info) => {
        const newEl = document.createElement("section");
        const table = document.createElement("table");

        section.appendChild(newEl);
        const mainInfo = {
            city: info.weatherDATA.name,
            country: info.weatherDATA.sys.country,
            currWeather: info.weatherDATA.weather[0].description,
            currIcon: info.weatherDATA.weather[0].icon,
        };
        section.innerHTML = `
        <p><strong>City: </strong>${mainInfo.city}</p>
        <p><strong>Country: </strong>${mainInfo.country}</p>
        <p><strong>Current Weather: </strong>${mainInfo.currWeather} <img class="customIcon" src="http://openweathermap.org/img/wn/${mainInfo.currIcon}@2x.png"></p>
        `;
        let tableData = new Array(); // new array Holds weekly weather data
        info.daily.map(function (el, index) {
            tableData.push(
                `<tr><th scope="row">${index}</th><td>${el.temp.min}°C</td><td>${el.temp.max}°C</td><td>
                <img src="http://openweathermap.org/img/wn/${el.weather[0].icon}@2x.png"></td></tr>`
            );
        });
        table.setAttribute("class", "table table-striped table-bordered");
        table.innerHTML = `
        <thead>
            <caption>Note: Temperature measured in Celcius (Metric) Unit</caption>
            <tr class="table-primary">
            <th scope="col">day</th>
            <th scope="col">min</th>
            <th scope="col">max</th>
            <th scope="col">weather</th>
            </tr>
        </thead>
        <tbody>
            ${tableData.join("")}
        </tbody>`; // Table html end
        section.appendChild(table);
    });
}
const btn = document.querySelector("button");
btn.addEventListener("click", (event) => {
    event.target.setAttribute("disabled", "true"); // temporarily disable submit button
    let inputVal = input[0].value;
    let weatherURL = `http://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${keyID}`;
    getCurrentWeather(weatherURL)
        .then(generateHTML)
        .catch((err) => {
            section.innerHTML = "<h3>City or zip code not found!</h3>";
            console.error(err);
        })
        .finally(
            () =>
                setTimeout(function () {
                    event.target.removeAttribute("disabled");
                }, 1000) // timeout for less strain when making API Calls
        );
});
