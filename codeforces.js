var s = 1;
if (currentMonth >= 7) {
    s = 0;
}
var fy = currentYear - s;
var sy = currentYear - s - 1;
var ty = currentYear - s - 2;
var fry = currentYear - s - 3;
var currentPage3 = 1;
var rowsPerPage3 = 10;
var filter = {
    all: true,
    year1: false,
    year2: false,
    year3: false,
    year4: false
};
var ratings3 = []; // Ratings data will be stored here after fetching

fetch('codeforces.json')
    .then(response => response.json())
    .then(data => {
        console.log('hellloooooooo')
        ratings3 = data;
        updateScoreboard3(); // Update the scoreboard once data is fetched
    })
    .catch(error => console.log('Error'));

var selectedRatingFilter = 'all'; // Initialize the selected rating filter

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput3");

    searchInput.addEventListener("input", function () {
        updateScoreboard3();
    });
});

function toggleFilters3() {
    console.log('filter3');
    var filter = document.querySelector('.filter-container3');
    var but = document.querySelector('.filter-button3');
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


function filterChanged3() {
    console.log('filter change 3');
    filter.year1 = document.getElementById('firstYearCheckbox3').checked;
    filter.year2 = document.getElementById('secondYearCheckbox3').checked;
    filter.year3 = document.getElementById('thirdYearCheckbox3').checked;
    filter.year4 = document.getElementById('fourthYearCheckbox3').checked;
    if (!filter.year1 && !filter.year2 && !filter.year3 && !filter.year4) {
        filter.all = true;
    }
    else {
        filter.all = false;
    }
    selectedRatingFilter = document.getElementById('ratingFilter3').value;
    updateScoreboard3();
}
function filterChanged31() {
    console.log('filter change 3');
    filter.year1 = document.getElementById('firstYearCheckbox31').checked;
    filter.year2 = document.getElementById('secondYearCheckbox31').checked;
    filter.year3 = document.getElementById('thirdYearCheckbox31').checked;
    filter.year4 = document.getElementById('fourthYearCheckbox31').checked;
    if (!filter.year1 && !filter.year2 && !filter.year3 && !filter.year4) {
        filter.all = true;
    }
    else {
        filter.all = false;
    }
    selectedRatingFilter = document.getElementById('ratingFilter31').value;
    updateScoreboard3();
}

function updateScoreboard3() {
    var searchQuery = document.getElementById('searchInput3').value.toLowerCase();
    var filteredRatings = ratings3.filter(function (rating) {
        var yearFilter =
            (filter.all ||
                (filter.year1 && rating.year == fy) ||
                (filter.year2 && rating.year == sy) ||
                (filter.year3 && rating.year == ty) ||
                (filter.year4 && rating.year == fry));

        var ratingFilter =
            selectedRatingFilter === 'all' ||
            (selectedRatingFilter === 'lessThan1400' && rating.codeforcesRating < 1400 && rating.codeforcesRating > 0) ||
            (selectedRatingFilter === '1400to1600' && rating.codeforcesRating >= 1400 && rating.codeforcesRating < 1600) ||
            (selectedRatingFilter === '1600to1800' && rating.codeforcesRating >= 1600 && rating.codeforcesRating < 1800) ||
            (selectedRatingFilter === '1800to2000' && rating.codeforcesRating >= 1800 && rating.codeforcesRating < 2000) ||
            (selectedRatingFilter === '2000to2200' && rating.codeforcesRating >= 2000 && rating.codeforcesRating < 2200) ||
            (selectedRatingFilter === '2200to2500' && rating.codeforcesRating >= 2200 && rating.codeforcesRating < 2500) ||
            (selectedRatingFilter === 'greaterThan2500' && rating.codeforcesRating >= 2500);

        var nameFilter = rating.name.toLowerCase().includes(searchQuery);

        return yearFilter && ratingFilter && nameFilter && rating.codeforcesRating > 0;
    });
    // Sort the ratings3 by CodeChef rating before displaying
    filteredRatings.sort(function (a, b) {
        console.log(a.codeforcesRating);
        return b.codeforcesRating - a.codeforcesRating;
    });
    var start3 = (currentPage3 - 1) * rowsPerPage3;
    var end3 = start3 + rowsPerPage3;
    var paginatedRatings3 = filteredRatings.slice(start3, end3);
    var tbody = document.querySelector('#scoreboard3');
    tbody.innerHTML = '';
    console.log('hii')
    for (var i = 0; i < paginatedRatings3.length; i++) {
        var tr = document.createElement('tr');
        tr.setAttribute('data-href', paginatedRatings3[i].url);
        tr.addEventListener('click', function () {
            var url = this.getAttribute('data-href');
            window.open(url, '_blank');
        });
        var tdRank = document.createElement('td');
        tdRank.textContent = start3 + i + 1;
        tdRank.className = "rank";
        tr.appendChild(tdRank);

        var tdImg = document.createElement('td');
        var img = document.createElement('img');
        img.src = paginatedRatings3[i].img; // Set the image source
        img.alt = ''; // Set the alt text for accessibility
        tdImg.appendChild(img);
        tr.appendChild(tdImg);

        var td = document.createElement('td');
        td.className = 'name-with-stars';

        var divContainer = document.createElement('div');
        divContainer.className = 'name-stars-container';

        var divName = document.createElement('div');
        divName.className = 'name';
        divName.textContent = paginatedRatings3[i].name;

        var divAdditionalInfo = document.createElement('div');
        divAdditionalInfo.className = 'additional-info';

        var spanYear = document.createElement('span');
        spanYear.className = 'year';
        spanYear.textContent = paginatedRatings3[i].year;

        var spanSeparator = document.createElement('span');
        spanSeparator.className = 'separator';
        spanSeparator.textContent = '|';

        var spanStars = document.createElement('span');
        spanStars.className = 'stars';
        spanStars.textContent = paginatedRatings3[i].stars;

        // Construct the structure by appending elements to each other
        divAdditionalInfo.appendChild(spanYear);
        divAdditionalInfo.appendChild(spanSeparator);
        divAdditionalInfo.appendChild(spanStars);

        divContainer.appendChild(divName);
        divContainer.appendChild(divAdditionalInfo);

        td.appendChild(divContainer);
        tr.appendChild(td);

        var tdRating = document.createElement('td');
        tdRating.textContent = paginatedRatings3[i].codeforcesRating;
        tr.appendChild(tdRating);

        tbody.appendChild(tr);
    }

    document.getElementById('pageNumber3').textContent = Math.min(currentPage3, Math.ceil(filteredRatings.length / rowsPerPage3)) + ' / ' + Math.ceil(filteredRatings.length / rowsPerPage3);
}

function nextPage3() {
    var searchQuery = document.getElementById('searchInput3').value.toLowerCase();
    var filteredRatings = ratings3.filter(function (rating) {
        var yearFilter =
            (filter.all ||
                (filter.year1 && rating.year == fy) ||
                (filter.year2 && rating.year == sy) ||
                (filter.year3 && rating.year == ty) ||
                (filter.year4 && rating.year == fry));

        var ratingFilter =
            selectedRatingFilter === 'all' ||
            (selectedRatingFilter === 'lessThan1400' && rating.codeforcesRating < 1400 && rating.codeforcesRating > 0) ||
            (selectedRatingFilter === '1400to1600' && rating.codeforcesRating >= 1400 && rating.codeforcesRating < 1600) ||
            (selectedRatingFilter === '1600to1800' && rating.codeforcesRating >= 1600 && rating.codeforcesRating < 1800) ||
            (selectedRatingFilter === '1800to2000' && rating.codeforcesRating >= 1800 && rating.codeforcesRating < 2000) ||
            (selectedRatingFilter === '2000to2200' && rating.codeforcesRating >= 2000 && rating.codeforcesRating < 2200) ||
            (selectedRatingFilter === '2200to2500' && rating.codeforcesRating >= 2200 && rating.codeforcesRating < 2500) ||
            (selectedRatingFilter === 'greaterThan2500' && rating.codeforcesRating >= 2500);

        var nameFilter = rating.name.toLowerCase().includes(searchQuery);

        return yearFilter && ratingFilter && nameFilter && rating.codeforcesRating > 0;
    });

    var totalPages3 = Math.ceil(filteredRatings.length / rowsPerPage3);

    if (currentPage3 < totalPages3) {
        currentPage3++;
        updateScoreboard3();
    }
}
function prevPage3() {
    if (currentPage3 > 1) {
        currentPage3--;
        updateScoreboard3();
    }
}
