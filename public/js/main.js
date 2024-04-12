document.addEventListener("DOMContentLoaded", () => {


    // Function to get jobs
    function getJobs() {

        //get element fom HTML code 
        const jobList = document.getElementById("jobList");
        const loadingIcon = document.getElementById("loadingIcon");

        if (loadingIcon) {
            loadingIcon.style.display = "block";//show loading icon while waiting on fetch 
        }
        if (jobList) {
            jobList.innerHTML = "";//clear joblist
        }

        fetch("https://backend-moment2-1-oqoy.onrender.com/api/work")
            .then(response => response.json())
            .then(data => {

                if (loadingIcon) {
                    loadingIcon.style.display = "none";//hide loading icon after fetch is done
                }

                //loop write to DOM
                if (jobList) {
                    data.forEach(job => {
                        const listItem = document.createElement("li");

                        // Lägg till ett ID baserat på jobbets ID
                        listItem.id = `job-${job.id}`;

                        listItem.innerHTML = `
                            <h3>${job.jobtitle}</h3>
                            <p><strong>Företag:</strong> ${job.companyname}</p>
                            <p><strong>Ort:</strong> ${job.location}</p>
                            <p><strong>Startdatum:</strong> ${job.startdate}</p>
                            <p><strong>Slutdatum:</strong> ${job.enddate ? job.enddate : "Pågående"}</p>
                            <p><strong>Beskrivning:</strong> ${job.description}</p><br>
                            <button class="removeBtn" data-job-id="${job.id}">Ta bort jobb</button>
                            `;

                        jobList.appendChild(listItem);

                        //event for remove-button to remove specific job
                        const removeBtn = listItem.querySelector(".removeBtn");


                        if (removeBtn) {
                            removeBtn.addEventListener("click", function (event) {
                                const jobId = event.currentTarget.dataset.jobId;
                                //call function to remove job from database and send with JobId
                                removeJob(jobId);
                            });
                        }



                    });
                }

            });

    }

    //function to remove job from database
    async function removeJob(jobId) {
        try {
            const response = await fetch(`https://backend-moment2-1-oqoy.onrender.com/api/work/${jobId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                const jobItem = document.getElementById(`job-${jobId}`);
                if (jobItem) {
                    jobItem.remove();                    
                    setTimeout(() => {
                        getJobs();
                    }, 1000); // Vänta 1 sekund innan du hämtar jobben igen
                } else {
                    console.error("Job item not found in DOM");
                }
            } else if (response.status === 404) {
                console.error("Job not found");
            } else {
                console.error("Error while trying to delete job", response.status);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // call function get jobs to load jobs
    getJobs();

    const addForm = document.getElementById("addForm");


    // eventlistener form
    if (addForm) {
        addForm.addEventListener("submit", function (event) {
            event.preventDefault();
          

            const formData = {
                companyname: document.getElementById("companyname").value,
                location: document.getElementById("location").value,
                jobtitle: document.getElementById("jobtitle").value,
                description: document.getElementById("description").value,
                startdate: document.getElementById("startdate").value,
                enddate: document.getElementById("enddate").value
            };

            fetch("https://backend-moment2-1-oqoy.onrender.com/api/work", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
                .then(response => {
                    return response.json();
                })

                .then(data => {
                    getJobs(); // Update list with jobs
                    addForm.reset(); // Clear form
                    window.location.href = "/";//redirect to index.ejs 
                });
        });
    };
});