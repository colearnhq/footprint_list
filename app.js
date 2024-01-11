let currentPage = 1;
let limitElement = 10;
let idDropDowns = ['subjectDropDown', 'semester', 'gradeDropDown'];
let allData = [];
let DataWhichFiltered = [];

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
    let gradeOptions = '<option value="">Pilih Grade</option>';
    let getUniqueGrades = [... new Set(allData.map(datum => datum.grade))].sort((a, b) => a - b);
    getUniqueGrades.forEach(datum => {
        gradeOptions += `
        <option value="${datum}">${datum}</option>
        `
    })

    // Menggunakan DataWhichFiltered untuk perhitungan jumlah total halaman
    const totalPages = Math.ceil(data.length / limitElement);

    let modifyData = data.slice((currentPage - 1) * limitElement, (currentPage) * limitElement);
    console.log(data.length)

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
                    <div>${datum.semester.includes('SMT2') ? '2023/2024 Semester 2' : '2023/2024 Semester 1'}</div>
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

    // Menerapkan filter berdasarkan subjek yang dipilih
    DataWhichFiltered = allData.filter((datum) => {
        if (selectedGrade < 4 && selectedSubject === "") {
            return datum.semester === selectedSemester;
        } else if (selectedGrade < 4) {
            return datum.subject === selectedSubject && datum.semester === selectedSemester;
        } else if (selectedGrade >=4 && selectedSubject === ""){
            return datum.grade === selectedGrade && datum.semester === selectedSemester;
        } return datum.grade === selectedGrade && datum.subject === selectedSubject && datum.semester === selectedSemester;
    }
    ).sort((a, b) => a.grade - b.grade);

    let footprintCountBasedOnFilter = DataWhichFiltered.length;
    document.getElementById("footprintCount").textContent = `Jumlah footprint yang ditampilkan: ${footprintCountBasedOnFilter} dari ${allData.length}`

    currentPage = 1;
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
            return splitTheKeyword.every(keyword => datum.file_name.toLowerCase().includes(keyword))
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

var SuperPlaceholder = function (options) {
    this.options = options;
    this.element = options.element
    this.placeholderIdx = 0;
    this.charIdx = 0;


    this.setPlaceholder = function () {
        placeholder = options.placeholders[this.placeholderIdx];
        var placeholderChunk = placeholder.substring(0, this.charIdx + 1);
        document.querySelector(this.element).setAttribute("placeholder", placeholderChunk)
    };

    this.onTickReverse = function (afterReverse) {
        if (this.charIdx === 0) {
            afterReverse.bind(this)();
            clearInterval(this.intervalId);
            this.init();
        } else {
            this.setPlaceholder();
            this.charIdx--;
        }
    };

    this.goReverse = function () {
        clearInterval(this.intervalId);
        this.intervalId = setInterval(this.onTickReverse.bind(this, function () {
            this.charIdx = 0;
            this.placeholderIdx++;
            if (this.placeholderIdx === options.placeholders.length) {
                // end of all placeholders reached
                this.placeholderIdx = 0;
            }
        }), this.options.speed)
    };

    this.onTick = function () {
        var placeholder = options.placeholders[this.placeholderIdx];
        if (this.charIdx === placeholder.length) {
            // end of a placeholder sentence reached
            setTimeout(this.goReverse.bind(this), this.options.stay);
        }

        this.setPlaceholder();

        this.charIdx++;
    }

    this.init = function () {
        this.intervalId = setInterval(this.onTick.bind(this), this.options.speed);
    }

    this.kill = function () {
        clearInterval(this.intervalId);
    }
}  
