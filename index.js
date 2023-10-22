document.addEventListener("DOMContentLoaded", function () {
    const csvFileInput = document.getElementById("csv-file");
    const tableBody = document.getElementById("table-body");

    // Add event listener to the html input field
    csvFileInput.addEventListener("change", function () {
        //Grab the file drom the input
        const file = csvFileInput.files[0];

        if (file) {
            // Create new instance for the file reader
            const reader = new FileReader();

            // Start parsing the file
            reader.onload = function (event) {
                // Grab the data from File Reader event
                const data = event.target.result;

                // Split the data string into new lines, a.k.a rows of data
                const rows = data.split("\n");

                // Clear the table
                tableBody.innerHTML = "";

                // Projects object to hold the parsed projects
                const projects = {};

                // Iterate through the split rows data,
                // starting from index 1 to skip the CSV file first row with headers
                for (let i = 1; i < rows.length; i++) {
                    // Define cols by splitting each row of data
                    const cols = rows[i].split(",");

                    // Check to see if we have 4 cols containing the data for each project
                    if (cols.length === 4) {
                        // Grab the individual pieces of data from the cols array
                        const empID = cols[0];
                        const projectID = cols[1];
                        const dateFrom = new Date(cols[2]);
                        let dateTo = cols[3] ? new Date(cols[3]) : new Date();

                        // Calculate days worked on the project and round to the nearest whole number
                        const daysWorked = Math.round(Math.abs((dateTo - dateFrom) / (24 * 60 * 60 * 1000)));

                        if (!projects[projectID]) {
                            projects[projectID] = [];
                        }

                        projects[projectID].push({
                            empID,
                            daysWorked,
                        });
                    }
                }

                // Loop through the split projects
                for (const projectID in projects) {
                    // Check if we have at least 2 employees that have worked on the current project
                    if (projects[projectID].length >= 2) {
                        // Sort employees by days worked in descending order
                        projects[projectID].sort((a, b) => b.daysWorked - a.daysWorked);
                        
                        // After the sort grab the first two employees by id from the array
                        const longestPair = [projects[projectID][0].empID, projects[projectID][1].empID];

                        // Calculate the total days worked
                        const daysWorked = projects[projectID][0].daysWorked + projects[projectID][1].daysWorked;

                        // Setup the html elements for the table
                        const row = document.createElement("tr");
                        const cell1 = document.createElement("td");
                        const cell2 = document.createElement("td");
                        const cell3 = document.createElement("td");
                        const cell4 = document.createElement("td");

                        // Push the data to the html elements
                        cell1.textContent = longestPair[0];
                        cell2.textContent = longestPair[1];
                        cell3.textContent = projectID;
                        cell4.textContent = daysWorked;

                        row.appendChild(cell1);
                        row.appendChild(cell2);
                        row.appendChild(cell3);
                        row.appendChild(cell4);

                        tableBody.appendChild(row);
                    }
                }
            };

            reader.readAsText(file);
        }
    });
});