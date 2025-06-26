// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', main);

const apiEndpoint = 'http://localhost:3000/films';

// Main function
async function main() {
  displayPosts();
  addNewPostListener();
}

// Fetch and display all movies
async function displayPosts() {
  try {
    const res = await fetch(apiEndpoint);
    const movies = await res.json();
    const filmsList = document.getElementById('films');
    filmsList.innerHTML = '';

    movies.forEach(movie => {
      const li = document.createElement('li');
      li.className = 'film item';
      li.textContent = movie.title;
      li.addEventListener('click', () => handlePostClick(movie.id));
      filmsList.appendChild(li);
    });

    // Show first movie
    if (movies.length > 0) handlePostClick(movies[0].id);
  } catch (err) {
    alert('Failed to load movies.');
  }
}

// Handle movie click
async function handlePostClick(id) {
  const res = await fetch(`${apiEndpoint}/${id}`);
  const movie = await res.json();
  const detail = document.getElementById('post-detail');
  const available = movie.capacity - movie.tickets_sold;

  detail.innerHTML = `
    <img src="${movie.poster}" alt="${movie.title}" style="max-width: 200px;">
    <h2>${movie.title}</h2>
    <p>${movie.description}</p>
    <p><strong>Runtime:</strong> ${movie.runtime} mins</p>
    <p><strong>Showtime:</strong> ${movie.showtime}</p>
    <p><strong>Available Tickets:</strong> <span id="ticket-count">${available}</span></p>
    <button id="buy-ticket">Buy Ticket</button>
    <button id="delete-post">Delete</button>
    <form id="edit-post-form">
      <input id="edit-title" value="${movie.title}" />
      <textarea id="edit-desc">${movie.description}</textarea>
      <button type="submit">Update</button>
    </form>
  `;

  document.getElementById('buy-ticket').onclick = () => buyTicket(movie);
  document.getElementById('delete-post').onclick = () => deletePost(movie.id);
  document.getElementById('edit-post-form').onsubmit = (e) => {
    e.preventDefault();
    updatePost(movie.id);
  };
}

// Buy ticket
function buyTicket(movie) {
  if (movie.tickets_sold >= movie.capacity) {
    alert('Sold out');
    return;
  }
  movie.tickets_sold++;
  document.getElementById('ticket-count').textContent = movie.capacity - movie.tickets_sold;
  fetch(`${apiEndpoint}/${movie.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tickets_sold: movie.tickets_sold })
  });
}

// Add new post
function addNewPostListener() {
  const form = document.getElementById('new-post-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = form.title.value;
    const description = form.description.value;
    const newMovie = {
      title,
      description,
      runtime: 100,
      capacity: 30,
      showtime: '7:00PM',
      tickets_sold: 0,
      poster: 'https://via.placeholder.com/150'
    };
    await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMovie)
    });
    displayPosts();
    form.reset();
  });
}

// Delete post
async function deletePost(id) {
  await fetch(`${apiEndpoint}/${id}`, { method: 'DELETE' });
  displayPosts();
  document.getElementById('post-detail').innerHTML = '<p>Movie deleted.</p>';
}

// Update post
async function updatePost(id) {
  const title = document.getElementById('edit-title').value;
  const description = document.getElementById('edit-desc').value;

  await fetch(`${apiEndpoint}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description })
  });

  displayPosts();
  handlePostClick(id);
}
