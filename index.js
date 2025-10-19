// === DOM ELEMENTS ===
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const podcastResults = document.getElementById("podcastResults");
const historyList = document.getElementById("historyList");

// === SEARCH FUNCTION ===
function searchPodcasts() {
  const query = searchInput.value.trim();
  if (!query) return;

  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=podcast`;

  // Show loading text
  podcastResults.innerHTML = `<p class="text-center text-info">Searching...</p>`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => displayResults(data.results))
    .catch((error) => {
      console.error("Error fetching podcasts:", error);
      podcastResults.innerHTML = `<p class="text-danger text-center">Something went wrong. Please try again.</p>`;
    });
}

// === DISPLAY RESULTS ===
function displayResults(podcasts) {
  podcastResults.innerHTML = ""; // Clear previous results

  if (podcasts.length === 0) {
    podcastResults.innerHTML = `<p class="text-center text-muted">No podcasts found.</p>`;
    return;
  }

  podcasts.forEach((podcast) => {
    const cardHTML = `
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="card h-100 shadow-sm border-0">
          <img src="${podcast.artworkUrl600}" class="card-img-top" alt="${podcast.collectionName}">
          <div class="card-body">
            <h5 class="card-title">${podcast.collectionName}</h5>
            <p class="card-text text-muted">${podcast.artistName || "Unknown Artist"}</p>
            <button 
              class="btn btn-outline-primary btn-sm play-btn"
              data-url="${podcast.collectionViewUrl}"
              data-title="${podcast.collectionName}"
              data-img="${podcast.artworkUrl600}">
              <i class="bi bi-play-circle"></i> Play Podcast
            </button>
          </div>
        </div>
      </div>
    `;
    podcastResults.innerHTML += cardHTML;
  });
}

// === SEARCH BUTTON & ENTER KEY ===
searchBtn.addEventListener("click", searchPodcasts);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchPodcasts();
});

// === HANDLE PLAY BUTTON CLICKS ===
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".play-btn");
  if (!btn) return;

  const podcast = {
    title: btn.getAttribute("data-title"),
    img: btn.getAttribute("data-img"),
    url: btn.getAttribute("data-url"),
  };

  if (!podcast.title || !podcast.img || !podcast.url) {
    console.warn("Missing podcast data:", podcast);
    return;
  }

  saveToHistory(podcast);
  renderHistory(); // updates the offcanvas instantly
  window.open(podcast.url, "_blank");
});

// === SAVE TO HISTORY ===
function saveToHistory(podcast) {
  let history = JSON.parse(localStorage.getItem("podcastHistory")) || [];

  // Avoid duplicates
  history = history.filter((item) => item.url !== podcast.url);

  // Add to top
  history.unshift(podcast);

  // Keep only last 10
  if (history.length > 10) history.pop();

  localStorage.setItem("podcastHistory", JSON.stringify(history));
}

// === RENDER HISTORY IN OFFCANVAS ===
function renderHistory() {
  const history = JSON.parse(localStorage.getItem("podcastHistory")) || [];

  if (history.length === 0) {
    historyList.innerHTML = `<p class="text-muted">No podcasts played yet.</p>`;
    return;
  }

  historyList.innerHTML = history
    .map(
      (p) => `
      <div class="d-flex align-items-center mb-2">
        <img src="${p.img}" alt="${p.title}" width="50" height="50" class="me-2 rounded">
        <a href="${p.url}" target="_blank" class="text-light text-decoration-none">
          ${p.title}
        </a>
      </div>
    `
    )
    .join("");
}

// === LOAD HISTORY WHEN PAGE LOADS ===
document.addEventListener("DOMContentLoaded", renderHistory);
