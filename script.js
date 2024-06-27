// const APIURL =
//   "https://api.themoviedb.org/3/discover/movie?api_key=04c35731a5ee918f014970082a0088b1";
// const IMGPATH = "https://image.tmdb.org/t/p/w1280";
// const SEARCHAPI =
//   "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const APIKEY = "ba0f4af0";
const APIURL = `https://www.omdbapi.com/?apikey=${APIKEY}&s=movie`;
const SEARCHAPI = `https://www.omdbapi.com/?apikey=${APIKEY}&s=`;

const main = document.getElementById("content");
const form = document.getElementById("form");
const search = document.getElementById("search");

getMovies(APIURL);

async function getMovies(url) {
  const resp = await fetch(url);
  const respData = await resp.json();

  // console.log(resp);
  // console.log(respData);

  showMovies(respData.Search);
}

async function showMovies(movies) {
  main.innerHTML = "";

  if (!movies) {
    main.innerHTML = "<h1>No results found</h1>";
    return;
  }

  for (const movie of movies) {
    const movieDetails = await getMovieDetails(movie.imdbID);
    const {
      Poster,
      Title,
      imdbRating,
      Plot,
      BoxOffice,
      Type,
      Actors,
      Language,
      Genre,
    } = movieDetails;

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");

    movieEl.innerHTML = `
            <img
                src="${
                  Poster !== "N/A"
                    ? Poster
                    : "https://via.placeholder.com/1280x720?text=No+Image"
                }"
                alt="${Title}"
            />
            <div class="movie-info">
                <h3>${Title}</h3>
                <span class="${getClassByRate(imdbRating)}">${imdbRating}</span>
            </div>
            <div class="overview">
                <h3>Overview : <span class="sub-para"> ${Plot} </span></h3>
                <h3>Type : <span class="sub-para"> ${Type} </span></h3>
                <h3>BoxOffice : <span class="sub-para"> ${BoxOffice} </span></h3>
                <h3>Genre : <span class="sub-para"> ${Genre} </span></h3>
                <h3>Cast : <span class="sub-para"> ${Actors} </span></h3>
                <h3>Language : <span class="sub-para"> ${Language} </span></h3>
            </div>
        `;

    main.appendChild(movieEl);
  }
}

async function getMovieDetails(id) {
  try {
    const resp = await fetch(`https://www.omdbapi.com/?apikey=${APIKEY}&i=${id}`);
    const respData = await resp.json();
    return respData;
  } catch (error) {
    console.error('Failed to fetch movie details:', error);
  }
}

function getClassByRate(vote) {
  if (!vote || vote === "N/A") return "gray";
  if (vote >= 8) {
    return "green";
  } else if (vote >= 3) {
    return "orange";
  } else {
    return "red";
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value;

  if (searchTerm) {
    getMovies(SEARCHAPI + searchTerm);

    search.value = "";
  }
});
