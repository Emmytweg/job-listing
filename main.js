// Global Variables
const mainCon = document.getElementById('mainContainer');
const selectedFiltersBox = document.createElement('div'); // Container for selected filters
selectedFiltersBox.classList.add('selected-filters');
const joiningBox = document.getElementById('#selected-filters')
joiningBox.append(selectedFiltersBox); // Add it to the top of the body

// Function to render jobs
const renderJobs = (jobs) => {
    mainCon.innerHTML = ''; // Clear the container before rendering
    jobs.forEach((item) => {
        const profileCon = document.createElement('div');
        profileCon.classList.add('mainProfileCon');

        profileCon.innerHTML = `
            <div class='profileCon' style='border-left:${item.featured ? '5px solid #5DA09C' : 'none'};'>
                <div class='firstSec'>
                    <div class='logoContainer'> 
                        <img src=${item.logo} alt=${item.company}>
                    </div>
                    <div class='detailedCon'>
                        <div class='upperPart'>
                            <p class='companyName'>${item.company}</p>
                            ${item.new ? `<button>NEW!</button>` : ''}
                            ${item.featured ? `<button>FEATURED</button>` : ''}
                        </div>
                        <h2 class='titleCon'>
                            ${item.position}
                        </h2>
                        <div class='lowerPartCon'>
                            <span>${item.postedAt}</span> <span class='circle'>o</span>
                            <span>${item.contract}</span> <span class='circle'>o</span>
                            <span>${item.location}</span>
                        </div>
                    </div>
                </div>
                <hr class='line' />
                <div class='lastCon'>
                    <button class='filter-btn' data-filter='role' data-value='${item.role}'>${item.role}</button>
                    <button class='filter-btn' data-filter='level' data-value='${item.level}'>${item.level}</button>
                    ${item.languages.map(lang => `<button class='filter-btn' data-filter='languages' data-value='${lang}'>${lang}</button>`).join('')}
                    ${item.tools.map(tool => `<button class='filter-btn' data-filter='tools' data-value='${tool}'>${tool}</button>`).join('')}
                </div>
            </div>
        `;
        mainCon.appendChild(profileCon);
    });
};

// Function to display selected filters
const updateSelectedFilters = (selectedFilters) => {
    selectedFiltersBox.innerHTML = ''; // Clear previous filters
    selectedFiltersBox.style.display= 'flex'
    selectedFilters.forEach((filter) => {
        const filterTag = document.createElement('span');
        filterTag.classList.add('filter-tag');

        // Add the filter text
        const filterText = document.createElement('span');
        filterText.textContent = filter;

        // Add the close button (X)
        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.classList.add('close-btn');
        closeButton.addEventListener('click', () => {
            const index = selectedFilters.indexOf(filter);
            if (index !== -1) selectedFilters.splice(index, 1); // Remove filter
            updateSelectedFilters(selectedFilters); // Update display
            filterJobs(selectedFilters); // Re-filter jobs
        });

        filterTag.appendChild(filterText);
        filterTag.appendChild(closeButton);
        selectedFiltersBox.appendChild(filterTag);
    });
};

// Function to filter jobs
const filterJobs = (selectedFilters) => {
    fetch('data.json')
        .then((res) => res.json())
        .then((data) => {
            const jobs = Object.values(data);

            // Apply all selected filters
            const filteredJobs = selectedFilters.length
                ? jobs.filter((job) =>
                      selectedFilters.every((filter) =>
                          [job.role, job.level, ...job.languages, ...job.tools].includes(filter)
                      )
                  )
                : jobs;

            renderJobs(filteredJobs);
        });
};

// Fetch and handle data
fetch('data.json')
    .then((res) => res.json())
    .then((data) => {
        const jobs = Object.values(data);

        // Initial rendering of jobs
        renderJobs(jobs);

        const selectedFilters = []; // Store selected filters

        // Add event listener for filtering
        mainCon.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                const filterValue = e.target.getAttribute('data-value');

                // Add to selected filters if not already present
                if (!selectedFilters.includes(filterValue)) {
                    selectedFilters.push(filterValue);
                    updateSelectedFilters(selectedFilters);
                }

                // Filter jobs
                filterJobs(selectedFilters);
            }
        });
    });
