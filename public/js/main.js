//hämtar element från HTML koden
const jobList = document.getElementById('jobList');
const addForm = document.getElementById('addForm');

// Funktion för att hämta tidigare jobb
function getJobs() {
    fetch('http://localhost:3000/posts')
    .then(response => response.json())
    .then(data => {
        
        //loopa igenom och ut till DOM
        jobList.innerHTML = '';
        data.forEach(job => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
            <h3>${job.jobtitle}</h3>
            <p><strong>Företag:</strong> ${job.companyname}</p>
            <p><strong>Ort:</strong> ${job.location}</p>
            <p><strong>Startdatum:</strong> ${job.startdate}</p>
            <p><strong>Slutdatum:</strong> ${job.enddate ? job.enddate : 'Pågående'}</p>
            <p><strong>Beskrivning:</strong> ${job.description}</p>
        `;
        jobList.appendChild(listItem);
        });
    });
}

// eventlyssnare
addForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const companyname = document.getElementById('companyname').value;
    const location = document.getElementById('location').value;
    const jobtitle = document.getElementById('jobtitle').value;
    const description = document.getElementById('description').value;
    const startdate = document.getElementById('startdate').value;
    const enddate = document.getElementById('enddate').value;

    fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ companyname, location, jobtitle, description, startdate, enddate })
    })
    .then(response => response.json())
    .then(data => {
        getJobs(); // Uppdatera listan med jobb
        document.getElementById('addForm').reset(); // Rensa formuläret
    });
});

// Ladda in befintliga poster när sidan laddas
getJobs();