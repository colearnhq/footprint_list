let currentPage = 1;
let limitElement = 10;
let idDropDowns = ['subjectDropDown', 'semester', 'gradeDropDown'];
let allData = [];
let DataWhichFiltered = [];
let slot_names = [];

fetch('https://script.google.com/macros/s/AKfycbyx5-zLeouuu1VzawqBARPp-wSHdLPnsK_fpmrKvAvZhrClOWnMYuEw1FS8bYRjFB9X/exec')
    .then((res) => {
        if (res.status != 200) {
            console.log('aduuh' + res.status);
            return;
        }

        res.json().then((res) => {
            allData = res;
            filterData();
        });

    })

    .catch((err) => console.log(err));

let changeElement = (data) => {
    let newEl = '';
    let gradeOptions = '<option value="">Grade</option>';
    let getUniqueGrades = [... new Set(allData.map(datum => datum.grade))].sort((a, b) => a - b);
    getUniqueGrades.forEach(datum => {
        gradeOptions += `
        <option value="${datum}">${datum}</option>
        `
    })

    // Menggunakan DataWhichFiltered untuk perhitungan jumlah total halaman
    const totalPages = Math.ceil(data.length / limitElement);

    let modifyData = data.slice((currentPage - 1) * limitElement, (currentPage) * limitElement);

    if (data.length === 0) {
        document.getElementById('area').classList.remove('grid');
        newEl += `<div class="data-unavailable">
                        <img src="https://colearn.id/_next/static/media/neco_bathing.4e793214.svg" alt="smurf" width="130" height="169">
                        <div>Oops, Data Tidak Tersedia</div>
                        <div>pastikan pemilihan grade atau subjeknya sesuai ya. Hati-hati format penulisan nama slotnya</div>
                  </div>`

    } else {
        document.getElementById('area').classList.add('grid');
        modifyData.forEach((datum) => {
            newEl += `
            <a class="${datum.subject === 'Maths' ? 'box' : datum.subject === 'Chemistry' ? 'chem-box' : 'phy-box'}" href="${datum.file_link}" target="_blank"">
                <div>
                    <div>${datum.grade + " " + datum.slot_name}</div>
                    <div>Subject: ${datum.subject}</div>
                </div>
                <div>
                    <div>${datum.semester}</div>
                </div>
            </a>
        `;
        });
    }

    let areaArticle = document.getElementById('area');
    let getOptionId = document.getElementById('gradeDropDown');
    let getValueOfTheLabel = getOptionId.value;
    getOptionId.innerHTML = gradeOptions;
    getOptionId.value = getValueOfTheLabel;
    areaArticle.innerHTML = newEl;

    // Mengatur teks jumlah halaman sesuai dengan totalPages
    document.getElementById("page").innerHTML = currentPage + " / " + totalPages;
};

let nextPage = () => {
    const totalPages = Math.ceil(DataWhichFiltered.length / limitElement);

    if (currentPage < totalPages) {
        currentPage += 1;
        changeElement(DataWhichFiltered);
    }
}

let previousPage = () => {
    if (currentPage > 1) {
        currentPage -= 1;
        changeElement(DataWhichFiltered);
    }
}

let filterData = () => {
    const selectedSubject = document.getElementById("subjectDropDown").value;
    const selectedSemester = document.getElementById("semester").value;
    const selectedGrade = document.getElementById("gradeDropDown").value;

    slot_names.length = 0;

    // Menerapkan filter berdasarkan subjek yang dipilih
    DataWhichFiltered = allData.filter((datum) => {
        if (selectedGrade < 4 && selectedSubject === "") {
            return datum.semester === selectedSemester;
        } else if (selectedGrade < 4) {
            return datum.subject === selectedSubject && datum.semester === selectedSemester;
        } else if (selectedGrade >= 4 && selectedSubject === "") {
            return datum.grade === selectedGrade && datum.semester === selectedSemester;
        } return datum.grade === selectedGrade && datum.subject === selectedSubject && datum.semester === selectedSemester;
    }
    ).sort((a, b) => a.grade - b.grade);

    let footprintCountBasedOnFilter = DataWhichFiltered.length;
    document.getElementById("footprintCount").textContent = `Number of Footprints displayed: ${footprintCountBasedOnFilter} of ${allData.length}`

    currentPage = 1;

    DataWhichFiltered.forEach(data => slot_names.push(data.file_name));
    changeElement(DataWhichFiltered);
};

let searchKeyword = () => {
    const textSearch = document.getElementById('search').value.toLowerCase();
    if (textSearch === '') {
        // Jika input pencarian kosong, perbarui tampilan ke posisi awal
        resetToInitialState();
    } else {
        resetToInitialState();
        const splitTheKeyword = textSearch.split(' ');
        const filteredData = DataWhichFiltered.filter(datum => {
            return splitTheKeyword.every(keyword => datum.file_name.toLowerCase().split(' ').includes(keyword))
        })
        changeElement(filteredData);
    }
};


let searchInput = document.getElementById('search');
searchInput.addEventListener('input', searchKeyword);

function resetToInitialState() {
    filterData();
}

idDropDowns.forEach((id) => {
    document.getElementById(id).addEventListener("change", filterData);
});
document.getElementById('goAhead').addEventListener("click", nextPage);
document.getElementById('getBack').addEventListener("click", previousPage);

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                    searchKeyword();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}


autocomplete(document.getElementById("search"), slot_names);
