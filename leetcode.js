// Add your JavaScript here
// const currentMonth = new Date().getMonth();
// const currentYear = new Date().getFullYear();
var s = 1;
if (currentMonth > 7) {
    s = 0;
}
var fy = currentYear - s;
var sy = currentYear - s - 1;
var ty = currentYear - s - 2;
var fry = currentYear - s - 3;
var currentPage2 = 1;
var rowsPerPage2 = 10;
var filter = {
    all: true,
    year1: false,
    year2: false,
    year3: false,
    year4: false
};
var ratings2 = []; // Ratings data will be stored here after fetching

fetch('leetcode.json')
    .then(response => response.json())
    .then(data => {
        ratings2 = data;
        updateScoreboard2(); // Update the scoreboard once data is fetched
    })
    .catch(error => console.log('Error fetching data:'));

var selectedRatingFilter = 'all'; // Initialize the selected rating filter

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput2");

    searchInput.addEventListener("input", function () {
        updateScoreboard2();
    });
});

function toggleFilters2() {
    var filter = document.getElementById('filterContainer2');
    var but = document.querySelector('.filter-button2');
    var overlay = document.querySelector('.overlay');
    if (filter.style.display === 'none' || filter.style.display === '') {
        filter.style.zIndex = '999';
        but.style.zIndex = '998';
        filter.style.display = 'block';
        overlay.classList.add('act');
    } else {
        filter.style.zIndex = '0';
        but.style.zIndex = '0';
        filter.style.display = 'none';
        overlay.classList.remove('act');
    }
}

function filterChanged2() {
    filter.year1 = document.getElementById('firstYearCheckbox2').checked;
    filter.year2 = document.getElementById('secondYearCheckbox2').checked;
    filter.year3 = document.getElementById('thirdYearCheckbox2').checked;
    filter.year4 = document.getElementById('fourthYearCheckbox2').checked;
    if (!filter.year1 && !filter.year2 && !filter.year3 && !filter.year4) {
        filter.all = true;
    }
    else {
        filter.all = false;
    }
    selectedRatingFilter = document.getElementById('ratingFilter2').value;
    updateScoreboard2();
}
function filterChanged21() {
    filter.year1 = document.getElementById('firstYearCheckbox21').checked;
    filter.year2 = document.getElementById('secondYearCheckbox21').checked;
    filter.year3 = document.getElementById('thirdYearCheckbox21').checked;
    filter.year4 = document.getElementById('fourthYearCheckbox21').checked;
    if (!filter.year1 && !filter.year2 && !filter.year3 && !filter.year4) {
        filter.all = true;
    }
    else {
        filter.all = false;
    }
    selectedRatingFilter = document.getElementById('ratingFilter21').value;
    updateScoreboard2();
}

function updateScoreboard2() {
    var searchQuery = document.getElementById('searchInput2').value.toLowerCase();
    var filteredRatings = ratings2.filter(function (rating) {
        var yearFilter =
            (filter.all ||
                (filter.year1 && rating.year == fy) ||
                (filter.year2 && rating.year == sy) ||
                (filter.year3 && rating.year == ty) ||
                (filter.year4 && rating.year == fry));

        var ratingFilter =
            selectedRatingFilter === 'all' ||
            (selectedRatingFilter === 'lessThan1400' && rating.leetcodeRating < 1400 && rating.leetcodeRating > 0) ||
            (selectedRatingFilter === '1400to1600' && rating.leetcodeRating >= 1400 && rating.leetcodeRating < 1600) ||
            (selectedRatingFilter === '1600to1800' && rating.leetcodeRating >= 1600 && rating.leetcodeRating < 1800) ||
            (selectedRatingFilter === '1800to2000' && rating.leetcodeRating >= 1800 && rating.leetcodeRating < 2000) ||
            (selectedRatingFilter === '2000to2200' && rating.leetcodeRating >= 2000 && rating.leetcodeRating < 2200) ||
            (selectedRatingFilter === '2200to2500' && rating.leetcodeRating >= 2200 && rating.leetcodeRating < 2500) ||
            (selectedRatingFilter === 'greaterThan2500' && rating.leetcodeRating >= 2500);

        var nameFilter = rating.name.toLowerCase().includes(searchQuery);

        return yearFilter && ratingFilter && nameFilter && rating.leetcodeRating > 0;
    });
    // Sort the ratings2 by CodeChef rating before displaying
    filteredRatings.sort(function (a, b) {
        console.log(a.leetcodeRating);
        return b.leetcodeRating - a.leetcodeRating;
    });

    var start2 = (currentPage2 - 1) * rowsPerPage2;
    var end = start2 + rowsPerPage2;
    var paginatedRatings = filteredRatings.slice(start2, end);

    var tbody = document.querySelector('#scoreboard2');
    tbody.innerHTML = '';

    for (var i = 0; i < paginatedRatings.length; i++) {
        var tr = document.createElement('tr');
        tr.setAttribute('data-href', paginatedRatings[i].url);
        tr.addEventListener('click', function () {
            var url = this.getAttribute('data-href');
            window.open(url, '_blank');
        });
        var tdRank = document.createElement('td');
        tdRank.textContent = start2 + i + 1;
        tdRank.className = "rank";
        tr.appendChild(tdRank);

        var tdImg = document.createElement('td');
        var img = document.createElement('img');
        img.src = paginatedRatings[i].img; // Set the image source
        img.alt = ''; // Set the alt text for accessibility
        tdImg.appendChild(img);
        tr.appendChild(tdImg);

        var td = document.createElement('td');
        td.className = 'name-with-stars';

        var divContainer = document.createElement('div');
        divContainer.className = 'name-stars-container';

        var divName = document.createElement('div');
        divName.className = 'name';
        divName.textContent = paginatedRatings[i].name;

        var divAdditionalInfo = document.createElement('div');
        divAdditionalInfo.className = 'additional-info';

        var spanYear = document.createElement('span');
        spanYear.className = 'year';
        spanYear.textContent = paginatedRatings[i].year;

        var spanSeparator = document.createElement('span');
        spanSeparator.className = 'separator';
        spanSeparator.textContent = '|';

        var spanStars = document.createElement('span');
        spanStars.className = 'stars';
        spanStars.textContent = paginatedRatings[i].stars;

        // Construct the structure by appending elements to each other
        divAdditionalInfo.appendChild(spanYear);
        divAdditionalInfo.appendChild(spanSeparator);
        divAdditionalInfo.appendChild(spanStars);

        divContainer.appendChild(divName);
        divContainer.appendChild(divAdditionalInfo);

        td.appendChild(divContainer);
        tr.appendChild(td);

        var tdRating = document.createElement('td');
        tdRating.textContent = paginatedRatings[i].leetcodeRating;
        tr.appendChild(tdRating);

        tbody.appendChild(tr);
    }

    document.getElementById('pageNumber2').textContent = Math.min(currentPage2, Math.ceil(filteredRatings.length / rowsPerPage2)) + ' / ' + Math.ceil(filteredRatings.length / rowsPerPage2);
}

function nextPage2() {
    var searchQuery = document.getElementById('searchInput2').value.toLowerCase();
    var filteredRatings = ratings2.filter(function (rating) {
        var yearFilter =
            (filter.all ||
                (filter.year1 && rating.year == fy) ||
                (filter.year2 && rating.year == sy) ||
                (filter.year3 && rating.year == ty) ||
                (filter.year4 && rating.year == fry));

        var ratingFilter =
            selectedRatingFilter === 'all' ||
            (selectedRatingFilter === 'lessThan1400' && rating.leetcodeRating < 1400 && rating.leetcodeRating > 0) ||
            (selectedRatingFilter === '1400to1600' && rating.leetcodeRating >= 1400 && rating.leetcodeRating < 1600) ||
            (selectedRatingFilter === '1600to1800' && rating.leetcodeRating >= 1600 && rating.leetcodeRating < 1800) ||
            (selectedRatingFilter === '1800to2000' && rating.leetcodeRating >= 1800 && rating.leetcodeRating < 2000) ||
            (selectedRatingFilter === '2000to2200' && rating.leetcodeRating >= 2000 && rating.leetcodeRating < 2200) ||
            (selectedRatingFilter === '2200to2500' && rating.leetcodeRating >= 2200 && rating.leetcodeRating < 2500) ||
            (selectedRatingFilter === 'greaterThan2500' && rating.leetcodeRating >= 2500);

        var nameFilter = rating.name.toLowerCase().includes(searchQuery);

        return yearFilter && ratingFilter && nameFilter && rating.leetcodeRating > 0;
    });

    var totalPages2 = Math.ceil(filteredRatings.length / rowsPerPage2);
    console.log(filteredRatings.length);
    console.log(rowsPerPage2);
    if (currentPage2 < totalPages2) {
        console.log(currentPage2);
        console.log(totalPages2);
        currentPage2++;
        updateScoreboard2();
    }
}
function prevPage2() {
    if (currentPage2 > 1) {
        currentPage2--;
        updateScoreboard2();
    }
}
