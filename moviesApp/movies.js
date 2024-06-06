let currentId = 0;

// list of all of movies in memory for sorting / repainting
let moviesList = [];

$(function() {
  // when you click the delete button, remove the closest parent tr

  $("#new-movie-form").on("submit", function(evt) {
    evt.preventDefault();
    let title = $("#title").val();
    let rating = $("#rating").val();

    if (title.length < 2 || rating < 0 || rating > 10) {
      alert('Title must be at least 2 characters long and rating must be between 0 and 10.');
      return;
    }

    let movieData = { title: title, rating: rating, currentId: currentId };
    let HTMLtoAppend = createMovieDataHTML(movieData);

    currentId++;
    moviesList.push(movieData);

    $("#movie-table-body").append(HTMLtoAppend);
    $("#new-movie-form").trigger("reset");
  });

  // when the delete button is clicked, remove the closest parent tr and remove from the array of movies

  $("tbody").on("click", ".btn.btn-danger", function(evt) {
    // find the index where this movie is
    let indexToRemoveAt = moviesList.findIndex(function(movie) {
      return movie.currentId === +$(evt.target).data("deleteId");
    });

    // remove it from the array of movies
    moviesList.splice(indexToRemoveAt, 1);

    // remove it from the DOM
    $(evt.target).closest("tr").remove();
  });

  // when an arrow is clicked, sort movies and update the DOM
  $(".fas").on("click", function(evt) {
    // figure out what direction we are sorting and the key to sort by
    let direction = $(evt.target).hasClass("fa-sort-down") ? "down" : "up";
    let keyToSortBy = $(evt.target).attr("id");
    let sortedMovies = sortBy(moviesList, keyToSortBy, direction);

    // empty the table
    $("#movie-table-body").empty();

    // loop over our sortedMovies array and append a new row
    for (let movie of sortedMovies) {
      let HTMLtoAppend = createMovieDataHTML(movie);
      $("#movie-table-body").append(HTMLtoAppend);
    }

    // toggle the arrow
    $(evt.target).toggleClass("fa-sort-down fa-sort-up");
  });
});

/* accepts an array of objects and a key and sorts by that key */
function sortBy(array, keyToSortBy, direction) {
  return array.slice().sort(function(a, b) {
    // since rating is a number, we have to convert these strings to numbers
    if (keyToSortBy === "rating") {
      a[keyToSortBy] = +a[keyToSortBy];
      b[keyToSortBy] = +b[keyToSortBy];
    }
    if (a[keyToSortBy] > b[keyToSortBy]) {
      return direction === "up" ? 1 : -1;
    } else if (a[keyToSortBy] < b[keyToSortBy]) {
      return direction === "up" ? -1 : 1;
    }
    return 0;
  });
}

/* createMovieDataHTML accepts an object with title and rating keys and returns a string of HTML */
function createMovieDataHTML(data) {
  return `
    <tr>
      <td>${data.title}</td>
      <td>${data.rating}</td>
      <td>
        <button class="btn btn-danger" data-delete-id="${data.currentId}">
          Delete
        </button>
      </td>
    </tr>
  `;
}