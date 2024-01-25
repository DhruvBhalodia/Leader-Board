// Add your JavaScript here
$(document).ready(function () {
    $('.leaderboard').hide();
    $('#codechefLeaderboard').show();
    $('.sidebar ul li').click(function () {
      $('.sidebar ul li').removeClass('active');
  
      // Add 'active' class to the clicked list item
      $(this).addClass('active');
  
      // Get the data attribute value to determine which leaderboard to display
      var leaderboardToShow = $(this).data('leaderboard');
  
      // Hide all leaderboards
  
      $('.leaderboard').hide();
  
      // Show the selected leaderboard
      $('#' + leaderboardToShow + 'Leaderboard').show();
  
      // Log the selected leaderboard to the console (for testing purposes)
      console.log(leaderboardToShow);
      // You can add logic here to handle the selected leaderboard as needed
    });
});

function toggleSidebar() {
  var sidebar = document.querySelector('.sidebar');
  var toggleSidebar = document.querySelector('.toggle-sidebar');
  var overlay = document.querySelector('.overlay');
  if (sidebar.style.display === 'none' || sidebar.style.display === '') {
    sidebar.style.display = 'block';
    toggleSidebar.style.zIndex = '999';
    sidebar.style.zIndex = '998';
    overlay.classList.add('act');
  } else {
    sidebar.style.display = 'none';
    toggleSidebar.style.zIndex = '0';
    sidebar.style.zIndex = '0';
    overlay.classList.remove('act');
  }
}

function toggleFilters() {
  var but = document.querySelector('.filter-button');
  var filter = document.getElementById('filterContainer');
  var overlay = document.querySelector('.overlay');
  if (filter.style.display === 'none' || filter.style.display === '') {
    filter.style.zIndex = '999';
    but.style.zIndex = '999';
    filter.style.display = 'block';
    overlay.classList.add('act');
  } else {
    filter.style.zIndex = '0';
    but.style.zIndex = '0';
    filter.style.display = 'none';
    overlay.classList.remove('act');
  }
}

function closes() {
  var but = document.querySelector('.filter-button');
  var but2 = document.querySelector('.filter-button2');
  var but3 = document.querySelector('.filter-button3');
  var filter = document.getElementById("filterContainer");
  var filter2 = document.getElementById("filterContainer2");
  var filter3 = document.getElementById("filterContainer3");
  if(filter.style.display === 'block'){
    console.log('1');
    filter.style.zIndex = '0';
    but.style.zIndex = '0';
    filter.style.display = 'none';
  }
  else if(filter2.style.display === 'block'){
    console.log('2');
    filter2.style.zIndex = '0';
    but2.style.zIndex = '0';
    filter2.style.display = 'none';
  }
  else if(filter3.style.display === 'block'){
    console.log('3');
    filter3.style.zIndex = '0';
    but3.style.zIndex = '0';
    filter3.style.display = 'none';
  }
  else if(document.getElementById("sidebar").style.display === 'block'){
    console.log('4');
    document.getElementById("sidebar").style.zIndex = "0";
    document.querySelector('.toggle-sidebar').style.zIndex = "0";
    document.getElementById("sidebar").style.display = "none";
  }
  overlay.classList.remove('act');
}

const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();
var s = 1;
if (currentMonth > 7) {
  s = 0;
}
var fy = currentYear - s;
var sy = currentYear - s - 1;
var ty = currentYear - s - 2;
var fry = currentYear - s - 3;
var currentPage = 1;
var rowsPerPage = 10;
var filter = {
  all: true,
  year1: false,
  year2: false,
  year3: false,
  year4: false
};
var ratings = []; // Ratings data will be stored here after fetching

fetch('codechef.json')
  .then(response => response.json())
  .then(data => {
    ratings = data; // Assign fetched data to the ratings array
    updateScoreboard(); // Update the scoreboard once data is fetched
  })
  .catch(error => console.error('Error fetching data:', error));

var selectedRatingFilter = 'all'; // Initialize the selected rating filter

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", function () {
    updateScoreboard();
  });
});

function filterChanged() {
  filter.year1 = document.getElementById('firstYearCheckbox').checked;
  filter.year2 = document.getElementById('secondYearCheckbox').checked;
  filter.year3 = document.getElementById('thirdYearCheckbox').checked;
  filter.year4 = document.getElementById('fourthYearCheckbox').checked;
  if (!filter.year1 && !filter.year2 && !filter.year3 && !filter.year4) {
    filter.all = true;
  }
  else {
    filter.all = false;
  }
  selectedRatingFilter = document.getElementById('ratingFilter').value;
  updateScoreboard();
}

function updateScoreboard() {
  var searchQuery = document.getElementById('searchInput').value.toLowerCase();
  var filteredRatings = ratings.filter(function (rating) {
    var yearFilter =
      (filter.all ||
        (filter.year1 && rating.year == fy) ||
        (filter.year2 && rating.year == sy) ||
        (filter.year3 && rating.year == ty) ||
        (filter.year4 && rating.year == fry));

    var ratingFilter =
      selectedRatingFilter === 'all' ||
      (selectedRatingFilter === 'lessThan1400' && rating.codechefRating < 1400) ||
      (selectedRatingFilter === '1400to1600' && rating.codechefRating >= 1400 && rating.codechefRating < 1600) ||
      (selectedRatingFilter === '1600to1800' && rating.codechefRating >= 1600 && rating.codechefRating < 1800) ||
      (selectedRatingFilter === '1800to2000' && rating.codechefRating >= 1800 && rating.codechefRating < 2000) ||
      (selectedRatingFilter === '2000to2200' && rating.codechefRating >= 2000 && rating.codechefRating < 2200) ||
      (selectedRatingFilter === '2200to2500' && rating.codechefRating >= 2200 && rating.codechefRating < 2500) ||
      (selectedRatingFilter === 'greaterThan2500' && rating.codechefRating >= 2500);

    var nameFilter = rating.name.toLowerCase().includes(searchQuery);

    return yearFilter && ratingFilter && nameFilter;
  });
  // Sort the ratings by CodeChef rating before displaying
  filteredRatings.sort(function (a, b) {
    console.log(a.codechefRating);
    return b.codechefRating - a.codechefRating;
  });

  var start = (currentPage - 1) * rowsPerPage;
  var end = start + rowsPerPage;
  var paginatedRatings = filteredRatings.slice(start, end);

  var tbody = document.querySelector('#scoreboard');
  tbody.innerHTML = '';

  for (var i = 0; i < paginatedRatings.length; i++) {
    var tr = document.createElement('tr');

    var tdRank = document.createElement('td');
    tdRank.textContent = start + i + 1;
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
    tdRating.textContent = paginatedRatings[i].codechefRating;
    tr.appendChild(tdRating);

    tbody.appendChild(tr);
  }

  document.getElementById('pageNumber').textContent = Math.min(currentPage, Math.ceil(filteredRatings.length / rowsPerPage)) + ' / ' + Math.ceil(filteredRatings.length / rowsPerPage);
}

function nextPage() {
  var filteredRatings = ratings.filter(function (rating) {
    var yearFilter =
      (filter.all ||
        (filter.year1 && rating.year == 1) ||
        (filter.year2 && rating.year == 2) ||
        (filter.year3 && rating.year == 3) ||
        (filter.year4 && rating.year == 4));

    var ratingFilter =
      selectedRatingFilter === 'all' ||
      (selectedRatingFilter === 'lessThan1400' && rating.codechefRating < 1400) ||
      (selectedRatingFilter === '1400to1600' && rating.codechefRating >= 1400 && rating.codechefRating < 1600) ||
      (selectedRatingFilter === '1600to1800' && rating.codechefRating >= 1600 && rating.codechefRating < 1800) ||
      (selectedRatingFilter === '1800to2000' && rating.codechefRating >= 1800 && rating.codechefRating < 2000) ||
      (selectedRatingFilter === '2000to2200' && rating.codechefRating >= 2000 && rating.codechefRating < 2200) ||
      (selectedRatingFilter === '2200to2500' && rating.codechefRating >= 2200 && rating.codechefRating < 2500) ||
      (selectedRatingFilter === 'greaterThan2500' && rating.codechefRating >= 2500);

    return yearFilter && ratingFilter;
  });

  var totalPages = Math.ceil(filteredRatings.length / rowsPerPage);

  if (currentPage < totalPages) {
    currentPage++;
    updateScoreboard();
  }
}
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    updateScoreboard();
  }
}
