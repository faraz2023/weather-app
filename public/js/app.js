console.log('Clinet side javascript')



const weatherForm = document.getElementById('search-form')
const searchLocationButton = document.querySelector('#search-location')
const currentLocationButton = document.querySelector('#current-location')
const location_input = document.getElementById('location')
const error_p = document.querySelector('#error')
const data_p = document.querySelector('#data')

m1.textContent = 'Your Move!!!'
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
                m1.textContent = `We present to you the info about ${data.location}:`
                m2.textContent = `Current tempeture is: ${data.current_temp}
                but it feels like ${data.apparent_temeture}`;
                m3.textContent = `Summary: ${data.summary}`;
                m4.textContent = `The chance of Rain: ${data.rain_chance}`;
                m5.textContent = `If you want to know:
                       Latitude: ${data.latitude}
                       Longitude: ${data.longitude}`;
                m5.style.color = 'red';
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
        console.log(latitude, longitude)
        api_url = `/wheather/bycurrentlocation?latitude=${latitude}&longitude=${longitude}`
        console.log(api_url)
        fetch(api_url).then(response => {
            response.json().then(data => {
                if (data.error) {
                    m1.textContent = ":("
                    m2.textContent = data.error
                    m3.textContent = '';
                    m4.textContent = '';
                    m5.textContent = '';

                } else {
                    m1.textContent = `You are approximately around ${data.location}:`
                    m2.textContent = `Current tempeture is: ${data.current_temp}
                    but it feels like ${data.apparent_temeture}`;
                    m3.textContent = `Summary: ${data.summary}`;
                    m4.textContent = `The chance of Rain: ${data.rain_chance}`;
                    m5.textContent = `If you want to know:
                           Latitude: ${data.latitude}
                           Longitude: ${data.longitude}`;
                    m5.style.color = 'red';
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