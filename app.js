let currentPage = 1;
let limitElement = 10;
let allData = [];
let DataWhichFiltered = []; // Menyimpan data yang sudah difilter

fetch('https://script.google.com/macros/s/AKfycbyshEBWdOvX7jSgiYvo_HhbRd9jxs_ncSoirtADHBn_ZB1KwlNu7iGn8rVkyjwvU6ABCA/exec')
    .then((res) => {
        if (res.status != 200) {
            console.log('aduuh' + res.status);
            return;
        }

        res.json().then((res) => {
            allData = res;
            DataWhichFiltered = res; // Menyimpan data awal yang belum difilter
            changeElement(res);
        });
    })

    .catch((err) => console.log(err));

let changeElement = (data) => {
    let newEl = '';

    // Menggunakan DataWhichFiltered untuk perhitungan jumlah total halaman
    const totalPages = Math.ceil(DataWhichFiltered.length / limitElement);

    let modifyData = DataWhichFiltered.slice((currentPage - 1) * limitElement, (currentPage) * limitElement);

    modifyData.forEach((datum) => {
        newEl += `
            <a class="${datum.subject === 'Maths' ? 'box' : datum.subject === 'Chemistry' ? 'chem-box' : 'phy-box'}" href="${datum.file_link}" target="_blank">
                <span class ="center">${datum.slot_name}</span>
                <br />
                <span class ="center">${datum.grade}</span>
                <br />
                <span class ="center">${datum.subject}</span>
            </a>
        `;
    });

    let areaArticle = document.getElementById('area');
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

    // Menerapkan filter berdasarkan subjek yang dipilih
    DataWhichFiltered = allData.filter((datum) => {
        return (
            (selectedSubject === "" || datum.subject === selectedSubject)
        );
    });

    // Reset currentPage ke 1 ketika filter berubah
    currentPage = 1;

    changeElement(DataWhichFiltered);
};

let searchKeyword = () => {
    const textSearch = document.getElementById('search').value.toLowerCase();

    if (textSearch === '') {
        // Jika input pencarian kosong, perbarui tampilan ke posisi awal
        resetToInitialState();
    } else {
        const filteredData = allData.filter((datum) => {
            return datum.file_name.toLowerCase().includes(textSearch);
        });

        DataWhichFiltered = filteredData;
        currentPage = 1; // Reset halaman ke halaman pertama
        changeElement(filteredData);
    }
};


let searchInput = document.getElementById('search');
searchInput.addEventListener('input', searchKeyword);

function resetToInitialState() {
    searchInput.value = ''; // Mengosongkan input pencarian
    // Mengembalikan tampilan ke posisi awal dengan filter yang diterapkan saat ini
    DataWhichFiltered = allData;
    currentPage = 1;
    changeElement(allData);
}

document.getElementById('subjectDropDown').addEventListener("change", filterData);
document.getElementById('goAhead').addEventListener("click", nextPage);
document.getElementById('getBack').addEventListener("click", previousPage);

var SuperPlaceholder = function(options) {  
    this.options = options;
    this.element = options.element
    this.placeholderIdx = 0;
    this.charIdx = 0;
    
  
    this.setPlaceholder = function() {
        placeholder = options.placeholders[this.placeholderIdx];
        var placeholderChunk = placeholder.substring(0, this.charIdx+1);
        document.querySelector(this.element).setAttribute("placeholder", placeholderChunk)
    };
    
    this.onTickReverse = function(afterReverse) {
      if (this.charIdx === 0) {
        afterReverse.bind(this)();
        clearInterval(this.intervalId); 
        this.init(); 
      } else {
        this.setPlaceholder();
        this.charIdx--;
      }
    };
    
    this.goReverse = function() {
        clearInterval(this.intervalId);
        this.intervalId = setInterval(this.onTickReverse.bind(this, function() {
          this.charIdx = 0;
          this.placeholderIdx++;
          if (this.placeholderIdx === options.placeholders.length) {
            // end of all placeholders reached
            this.placeholderIdx = 0;
          }
        }), this.options.speed)
    };
    
    this.onTick = function() {
        var placeholder = options.placeholders[this.placeholderIdx];
        if (this.charIdx === placeholder.length) {
          // end of a placeholder sentence reached
          setTimeout(this.goReverse.bind(this), this.options.stay);
        }
        
        this.setPlaceholder();
      
        this.charIdx++;
      }
    
    this.init = function() {
      this.intervalId = setInterval(this.onTick.bind(this), this.options.speed);
    }
    
    this.kill = function() {
      clearInterval(this.intervalId); 
    }
  }  
