const weatherForm = document.getElementById('search-form')
const searchLocationButton = document.querySelector('#search-location')
const currentLocationButton = document.querySelector('#current-location')
const location_input = document.getElementById('location')
const error_p = document.querySelector('#error')
const data_p = document.querySelector('#data')

// set the dimensions and margins of the graph
var margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = 920 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Initialize the X axis
var x = d3.scaleBand()
    .range([0, width])
    .padding(0.2);
var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")

// Initialize the Y axis
var y = d3.scaleLinear()
    .range([height, 0]);
var yAxis = svg.append("g")
    .attr("class", "myYaxis")

let daily_data;

m1.textContent = 'Your Move!!!'

const update = (option) => {

    daily_data.forEach(element => {
        date = new Date(element.time * 1000);
        element.date = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    })

    let color = ''
    switch (option) {
        case "MaximumTemp":
            data = daily_data.map(element => { return { "group": element.date, "value": element.temperatureMax } })
            color = '#f0ad4e'
            break;
        case 'MinimumTemp':
            data = daily_data.map(element => { return { "group": element.date, "value": element.temperatureMin } })
            color = '#0275d8'
            break;
        case 'PrecipProbability':
            data = daily_data.map(element => { return { "group": element.date, "value": element.precipProbability } })
            color = '#5cb85c'
            break;
        default:
            data = daily_data.map(element => { return { "group": element.date, "value": element.temperatureMax } })
    }
    // Update the X axis
    x.domain(data.map(function (d) { return d.group; }))
    xAxis.call(d3.axisBottom(x))

    // Update the Y axis
    y.domain([0, d3.max(data, function (d) { return d.value })]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    // Create the u variable
    var u = svg.selectAll("rect")
        .data(data)

    u
        .enter()
        .append("rect") // Add a new rect for each new elements
        .merge(u) // get the already existing elements as well
        .transition() // and apply changes to all of them
        .duration(1000)
        .attr("x", function (d) { return x(d.group); })
        .attr("y", function (d) { return y(d.value); })
        .attr("width", x.bandwidth())
        .attr("height", function (d) { return height - y(d.value); })
        .attr("fill", color)

    // If less group in the new dataset, I delete the ones not in use anymore
    u
        .exit()
        .remove()
}
const render_messages = (data) => {


    //m2.textContent = `${data.daily_data[0].time}`
    m1.textContent = `We present to you the info about ${data.location}:`
    m2.textContent = `Current tempeture is: ${data.current_temp}
                but it feels like ${ data.apparent_temeture}
                (${Math.round((data.current_temp - 32) * 5 / 9 * 100) / 100} and 
                ${Math.round((data.apparent_temeture - 32) * 5 / 9 * 100) / 100} in Celsius)`;
    m3.textContent = `Summary: ${data.summary} `;
    m4.textContent = `The chance of Rain: ${data.rain_chance} `;
    m5.textContent = `If you want to know:
                Latitude: ${ data.latitude}
                Longitude: ${ data.longitude} `;
    m5.style.color = 'red';
}

const render_daily_data = (daily_data) => {

    document.getElementById('my_dataviz').style.visibility = 'visible'



    // A function that create / update the plot for a given variable:

    // Initialize the plot with the first dataset
    update('MaximumTemp')

}

searchLocationButton.addEventListener('click', (e) => {
    //prevent the browser to refresh by default on submit
    e.preventDefault()

    const location = location_input.value;


    fetch(`/wheather?address=${encodeURIComponent(location)}`).then(response => {
        response.json().then(data => {
            if (data.error) {
                m1.textContent = ":("
                m2.textContent = data.error
                m3.textContent = '';
                m4.textContent = '';
                m5.textContent = '';

            } else {
                render_messages(data)
                daily_data = data.daily_data
                render_daily_data(daily_data)

            }
        })
    })

})


currentLocationButton.addEventListener('click', (e) => {

    //prevent the browser to refresh by default on submit
    e.preventDefault()


    function success(position) {


        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        api_url = `/wheather/bycurrentlocation?latitude=${latitude}&longitude=${longitude}`
        fetch(api_url).then(response => {
            response.json().then(data => {
                if (data.error) {
                    m1.textContent = ":("
                    m2.textContent = data.error
                    m3.textContent = '';
                    m4.textContent = '';
                    m5.textContent = '';

                } else {
                    render_messages(data)
                    daily_data = data.daily_data
                    render_daily_data(daily_data)

                }
            })
        })


    }

    function error() {
        m2.textContent = 'Unable to retrieve your location';
    }

    if (!navigator.geolocation) {
        m2.textContent = 'Geolocation is not supported by your browser';
    } else {
        status.textContent = 'Locating…';
        navigator.geolocation.getCurrentPosition(success, error);
    }



});



