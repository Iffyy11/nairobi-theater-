// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', main);

// API endpoint
const apiEndpoint = 'http://localhost:3000/films';



// Main function
async function main() {
    const movieData = await fetchMovieData();

    if (movieData.length > 0) {
        displayMovieDetailsAndList(movieData);
    } else {
        alert('Error loading movie data. Please try again later.');
    }
}

// Fetch movie data from the server
async function fetchMovieData() {
    try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movie data:', error);
        return [];
    }
}

// Display movie list and initial details
function displayMovieDetailsAndList(movieData) {
    const filmsList = document.getElementById('films');

    // Clear any existing list
    filmsList.innerHTML = '';

    // Add each movie to the list
    movieData.forEach(movie => {
        const filmItem = document.createElement('li');
        filmItem.classList.add('film', 'item');
        filmItem.textContent = movie.title;

        filmItem.addEventListener('click', () => {
            displayMovieDetails(movie);
        });

        filmsList.appendChild(filmItem);
    });

    // Show first movie by default
    displayMovieDetails(movieData[0]);
}

// Show movie details
function displayMovieDetails(movie) {
    const movieDetails = document.getElementById('movie-details');

    const availableTickets = movie.capacity - movie.tickets_sold;

    movieDetails.innerHTML = `
        <img src="${movie.poster}" alt="${movie.title}" style="max-width: 200px;">
        <h2>${movie.title}</h2>
        <p>${movie.description}</p>
        <p><strong>Runtime:</strong> ${movie.runtime} mins</p>
        <p><strong>Showtime:</strong> ${movie.showtime}</p>
        <p><strong>Available Tickets:</strong> <span id="ticket-count">${availableTickets}</span></p>
        <button id="buy-ticket">Buy Ticket</button>
    `;

    // Add Buy Ticket functionality
    document.getElementById('buy-ticket').addEventListener('click', () => {
        if (movie.tickets_sold < movie.capacity) {
            movie.tickets_sold++;
            document.getElementById('ticket-count').textContent = movie.capacity - movie.tickets_sold;
            if (movie.tickets_sold >= movie.capacity) {
                document.getElementById('buy-ticket').textContent = 'Sold Out';
            }
            alert('You bought a ticket!');
        } else {
            alert('Sorry, this movie is sold out!');
            document.getElementById('buy-ticket').textContent = 'Sold Out';
        }
    });
}
