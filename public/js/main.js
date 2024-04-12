document.addEventListener("DOMContentLoaded", () => {


    // Function to get jobs
    function getJobs() {

        //get element fom HTML code 
        const jobList = document.getElementById("jobList");
        const loadingIcon = document.getElementById("loadingIcon");

        if (jobList) {
            jobList.innerHTML = '';//clear joblist
        }

        if (loadingIcon) {
            loadingIcon.style.display = "block";//show loading icon while waiting on fetch 
        }

        fetch('https://backend-moment2-1-oqoy.onrender.com/api/work')
            .then(response => response.json())
            .then(data => {

                if (loadingIcon) {
                    loadingIcon.style.display = "none";//hide loading icon after fetch is done
                }

                //loop write to DOM
                if (jobList) {
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
                }

            });

    }

    // call function get jobs to load jobs
    getJobs();

    const addForm = document.getElementById("addForm");
    const ongoing = document.getElementById("ongoing");
    const endDate = document.getElementById("enddate");

    // eventlistener form
    if (addForm) {
        addForm.addEventListener('submit', function (event) {
            event.preventDefault();

            let enddateValue = endDate.value;
            if(ongoing.checked) {
                enddateValue = "Pågående";
            }

            const formData ={
            companyname: document.getElementById("companyname").value,
            location: document.getElementById("location").value,
            jobtitle: document.getElementById("jobtitle").value,
            description: document.getElementById("description").value,
            startdate: document.getElementById("startdate").value,
            enddate: enddateValue
            };

        

            fetch('https://backend-moment2-1-oqoy.onrender.com/api/work', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            
            })
            .then(response => {
                console.log("Response status:", response.status);
                return response.json();
            })

            .then(data => {                   
                getJobs(); // Update list with jobs
                addForm.reset(); // Clear form
            });
        });

        //event for altering ongoing job or end date on job
        ongoing.addEventListener("change", function(){
            if(this.checked) {
                endDate.disabled = true;
                endDate.value ="";
            } else {
                endDate.disabled = false;
            }
        });
    };

});