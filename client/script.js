const url = 'http://localhost:3000/movies';

window.addEventListener('load', fetchData);


function fetchData() {
  fetch(url)
    .then((result) => result.json())
    .then((movies) => {
      if (movies.length > 0) {

        // Sortera filmer efter pris i stigande ordning
        movies.sort((a, b) => a.price - b.price);

        let html = `<ul class="w-3/4 my-3 mx-auto flex flex-wrap gap-2 justify-center">`;
        movies.forEach((movie) => {
          //färger för pris skillnader
          let bgColor = getColorClass(movie.price, "bg");
          let textColor = getColorClass(movie.price, "text");
          let borderColor = getColorClass(movie.price, "border");

          html += `
            <li class="${bgColor} basis-1/4 ${textColor} p-2 rounded-md border-2 ${borderColor} flex flex-col justify-between">
              <h3>Title: ${movie.title}</h3>
              <p>Release date: ${movie.releaseDate}</p>
              <p>Director: ${movie.director}</p>
              <p>Price: ${movie.price}</p>
              <div>
                <button
                  class="border ${borderColor} rounded-md bg-white/50 p-1 text-sm mt-2"
                  onclick="setCurrentMovie(${movie.id})"
                >
                  Update
                </button>
                <button
                  class="border ${borderColor} rounded-md bg-white/50 p-1 text-sm mt-2"
                  onclick="deleteMovie(${movie.id})"
                >
                  Delete
                </button>
              </div>
            </li>`;
        });
        html += `</ul>`;
        document.getElementById("listContainer").innerHTML = html;
      }
    });
}

//Funktionen för färg baserat på pris
function getColorClass(price, type) {
  if (type === "text") {
    // Textfärger för kontrast
    if (price < 100) {
      return `${type}-black`; // Svart text på grön bakgrund
    } else if (price >= 100 && price < 200) {
      return `${type}-black`; // Svart text på gul bakgrund
    } else {
      return `${type}-white`; // Vit text på röd bakgrund
    }
  }

  // Bakgrunds och kantfärger
  if (price < 100) {
    return `${type}-green-300`; // Låg prisnivå
  } else if (price >= 100 && price < 200) {
    return `${type}-yellow-300`; // Mellanpris
  } else {
    return `${type}-red-300`; // Högt pris
  }
}

function setCurrentMovie(id) {
  console.log('current', id);

  fetch(`${url}/${id}`)
    .then((result) => result.json())
    .then((movie) => {
      console.log(movie);

      document.getElementById('updateTitle').value = movie.title;
      document.getElementById('updateReleaseDate').value = movie.releaseDate;
      document.getElementById('updatePrice').value = movie.price;
      document.getElementById('updateDirector').value = movie.director;

      localStorage.setItem('currentId', movie.id);

      document.getElementById('updateModal').classList.remove('hidden');
    });
}

function closeModal() {
  document.getElementById('updateModal').classList.add('hidden');
}

function deleteMovie(id) {
  console.log('delete', id);
  alert("movie deleted!")
  fetch(`${url}/${id}`, { method: 'DELETE' }).then((result) => fetchData());
}

movieForm.addEventListener('submit', handleSubmit);
updateModal.addEventListener('submit', handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
  const serverMovieObject = {
    title: '',
    releaseDate: '',
    director: '',
    price: ''
  };

  /* kollar vilken form vi arbetar med */
  if (e.target.id === 'modalMovieForm') {
    serverMovieObject.title = modalMovieForm.updateTitle.value;
    serverMovieObject.releaseDate = modalMovieForm.updateReleaseDate.value;
    serverMovieObject.director = modalMovieForm.updateDirector.value;
    serverMovieObject.price = modalMovieForm.updatePrice.value;
  } else {
    serverMovieObject.title = movieForm.title.value;
    serverMovieObject.releaseDate = movieForm.releaseDate.value;
    serverMovieObject.director = movieForm.director.value;
    serverMovieObject.price = movieForm.price.value;
  }



  const id = localStorage.getItem('currentId');
  if (id) {
    serverMovieObject.id = id;
  }

  const request = new Request(url, {
    method: serverMovieObject.id ? 'PUT' : 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(serverMovieObject)
  });

  fetch(request).then((response) => {
    if (response.ok) {
      if (serverMovieObject.id) { //om resursen vi håller på med redan har ett ID vet vi att det är en film som har blivit uppdaterad
        alert('Film Uppdaterad!');
      } else {
        alert('Film tillagd!');
      }
    }

    fetchData();

    localStorage.removeItem('currentId');
    movieForm.reset();
  });
}
