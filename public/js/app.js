console.log('Clinet side javascript')



const weatherForm = document.getElementById('search-form')
const location_input = document.getElementById('location')
const error_p = document.querySelector('#error')
const data_p = document.querySelector('#data')

error_p.textContent = 'Loading...'
weatherForm.addEventListener('submit', (e) => {
    //prevent the browser to refresh by default on submit
    e.preventDefault()

    const location = location_input.value;


    fetch(`/wheather?address=${encodeURIComponent(location)}`).then(response => {
        response.json().then(data => {
            if (data.error) {
                error_p.textContent = data.error
            } else {
                error_p.textContent = data.location
                data_p.textContent = data.current_temp;

            }
        })
    })

})