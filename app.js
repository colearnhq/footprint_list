let currentPage = 1;
let limitElement = 10;
let idDropDowns = ['subjectDropDown', 'semester', 'gradeDropDown'];
let allData = [];
let DataWhichFiltered = [];
let slot_names = [];

// Fetch data from API
fetch('https://script.google.com/macros/s/AKfycbyx5-zLeouuu1VzawqBARPp-wSHdLPnsK_fpmrKvAvZhrClOWnMYuEw1FS8bYRjFB9X/exec')
    .then((res) => {
        if (res.status !== 200) {
            console.error('Fetch failed with status:', res.status);
            return;
        }
        return res.json();
    })
    .then((res) => {
        if (!Array.isArray(res)) {
            console.error('Invalid response format:', res);
            return;
        }
        allData = res;
        filterData();
        populateDropdowns();
    })
    .catch((err) => console.error('Fetch error:', err));

// Populate dropdowns
const populateDropdowns = () => {
    const grades = [...new Set(allData.map(data => data.grade))].sort();
    const subjects = [...new Set(allData.map(data => data.subject))].sort((a, b) => String(a).localeCompare(String(b)));
    const semesters = [...new Set(allData.map(data => data.semester))].sort((a, b) => String(a).localeCompare(String(b)));

    putOptionsOnDropdown(grades, "Grade", "gradeDropDown");
    putOptionsOnDropdown(subjects, "Subject", "subjectDropDown");
    putOptionsOnDropdown(semesters, "Semester", "semester");
};

// Utility to add options to dropdowns
const putOptionsOnDropdown = (data, identifier, id) => {
    let options = `<option value="">${identifier}</option>`;
    const optionId = document.getElementById(id);

    if (!optionId) {
        console.error(`Dropdown with id ${id} not found`);
        return;
    }

    data.forEach(value => {
        options += `<option value="${value}">${value}</option>`;
    });

    optionId.innerHTML = options;
};

// Filter data based on dropdown selection
const filterData = () => {
    const selectedSubject = document.getElementById("subjectDropDown").value || "";
    const selectedSemester = document.getElementById("semester").value || "";
    const selectedGrade = document.getElementById("gradeDropDown").value || "";

    slot_names.length = 0;

    DataWhichFiltered = allData.filter((datum) => {
        return (!selectedGrade || datum.grade === selectedGrade) &&
            (!selectedSubject || datum.subject === selectedSubject) &&
            (!selectedSemester || datum.semester === selectedSemester);
    });

    document.getElementById("footprintCount").textContent =
        `Number of Footprints displayed: ${DataWhichFiltered.length} of ${allData.length}`;

    currentPage = 1;

    DataWhichFiltered.forEach(data => slot_names.push(data.file_name));
    changeElement(DataWhichFiltered);
};

// Update elements on the page
const changeElement = (data) => {
    const areaArticle = document.getElementById('area');
    const totalPages = Math.ceil(data.length / limitElement);

    if (!areaArticle) {
        console.error("Area element not found");
        return;
    }

    let newEl = '';

    if (data.length === 0) {
        areaArticle.classList.remove('grid');
        newEl = `<div class="data-unavailable">
                    <img src="https://colearn.id/_next/static/media/neco_bathing.4e793214.svg" alt="smurf" width="130" height="169">
                    <div>Oops, Data Tidak Tersedia</div>
                    <div>Pastikan pemilihan grade atau subjeknya sesuai ya. Hati-hati format penulisan nama slotnya</div>
                 </div>`;
    } else {
        areaArticle.classList.add('grid');
        const modifyData = data.slice((currentPage - 1) * limitElement, currentPage * limitElement);

        modifyData.forEach((datum) => {
            newEl += `
                <a class="${datum.subject === 'Maths' ? 'box' : datum.subject === 'Chemistry' ? 'chem-box' : 'phy-box'}" href="${datum.file_link}" target="_blank">
                    <div>
                        <div>${datum.grade + " " + datum.slot_name}</div>
                        <div>Subject: ${datum.subject}</div>
                    </div>
                    <div>${datum.semester}</div>
                </a>
            `;
        });
    }

    areaArticle.innerHTML = newEl;
    document.getElementById("page").innerHTML = `${currentPage} / ${totalPages}`;
};

// Pagination
const nextPage = () => {
    const totalPages = Math.ceil(DataWhichFiltered.length / limitElement);
    if (currentPage < totalPages) {
        currentPage += 1;
        changeElement(DataWhichFiltered);
    }
};

const previousPage = () => {
    if (currentPage > 1) {
        currentPage -= 1;
        changeElement(DataWhichFiltered);
    }
};

// Search
const searchKeyword = () => {
    const textSearch = document.getElementById('search').value.toLowerCase();
    if (!textSearch) {
        resetToInitialState();
        return;
    }
    const splitKeywords = textSearch.split(' ');
    const filteredData = DataWhichFiltered.filter(datum => {
        return splitKeywords.every(keyword => datum.file_name.toLowerCase().includes(keyword));
    });
    changeElement(filteredData);
};

function resetToInitialState() {
    filterData();
}

// Add event listeners
idDropDowns.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener("change", filterData);
    } else {
        console.error(`Element with id ${id} not found`);
    }
});
document.getElementById('goAhead').addEventListener("click", nextPage);
document.getElementById('getBack').addEventListener("click", previousPage);

// Autocomplete for search
function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function () {
        // Autocomplete implementation...
    });
}

autocomplete(document.getElementById("search"), slot_names);
