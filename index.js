
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const podcastResults = document.getElementById('podcastResults');


function searchPodcasts() {
  const query = searchInput.value.trim();
  if (!query) return;

  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=podcast`;

  
  podcastResults.innerHTML = `<p class="text-center text-info">Searching...</p>`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayResults(data.results);
    })
    .catch(error => {
      console.error("Error fetching podcasts:", error);
      podcastResults.innerHTML = `<p class="text-danger text-center">Something went wrong. Please try again.</p>`;
    });
}

// Function to display results using innerHTML
function displayResults(podcasts) {
  podcastResults.innerHTML = ""; // Clear previous results

  if (podcasts.length === 0) {
    podcastResults.innerHTML = `<p class="text-center text-muted">No podcasts found.</p>`;
    return;
  }

  podcasts.forEach(podcast => {
    
    const cardHTML = `
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="card h-100 shadow-sm border-0">
          <img src="${podcast.artworkUrl600}" class="card-img-top" alt="${podcast.collectionName}">
          <div class="card-body">
            <h5 class="card-title">${podcast.collectionName}</h5>
            <p class="card-text text-muted">${podcast.artistName || "Unknown Artist"}</p>
            <a href="${podcast.collectionViewUrl}" target="_blank" class="btn btn-outline-primary btn-sm">
              View on iTunes
            </a>
          </div>
        </div>
      </div>
    `;

    
    podcastResults.innerHTML += cardHTML;
  });
}


searchBtn.addEventListener('click', searchPodcasts);
searchInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    searchPodcasts();
  }
});
