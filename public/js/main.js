document.addEventListener("DOMContentLoaded", () => {

    //get element fom HTML code 
    const jobList = document.getElementById("jobList");
    const addForm = document.getElementById("addForm");
    const loadingIcon = document.getElementById("loading");

    // Function to get jobs
    function getJobs() {

        loadingIcon.style.display = "block";//show loading icon while waiting on fetch 

        fetch('https://backend-moment2-1-oqoy.onrender.com/api/work')
            .then(response => response.json())
            .then(data => {

                loadingIcon.style.display = "none";//hide loading icon after fetch is done

                //loop write to DOM
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

    // call function get jobs to load jobs
    getJobs();

    // eventlistener form
    if (addForm) {
        addForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const companyname = document.getElementById('companyname').value;
            const location = document.getElementById('location').value;
            const jobtitle = document.getElementById('jobtitle').value;
            const description = document.getElementById('description').value;
            const startdate = document.getElementById('startdate').value;
            const enddate = document.getElementById('enddate').value;

            fetch('https://backend-moment2-1-oqoy.onrender.com/api/work', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ companyname, location, jobtitle, description, startdate, enddate })
            })
                .then(response => response.json())
                .then(data => {
                    getJobs(); // Update list with jobs
                    document.getElementById('addForm').reset(); // Clear form
                });
        });
    };

});