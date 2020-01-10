console.log('Clinet side javascript')



const weatherForm = document.getElementById('search-form')
const location_input = document.getElementById('location')
const error_p = document.querySelector('#error')
const data_p = document.querySelector('#data')

m1.textContent = 'Your Move!!!'
weatherForm.addEventListener('submit', (e) => {
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