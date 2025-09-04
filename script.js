// Fetch the games.json file and display games grouped by decade/year
fetch("games.json")
  .then(response => response.json())
  .then(data => renderGames(data));

// Render games by decade and year
function renderGames(games) {
  const gameList = document.getElementById("game-list");

  // Sort by release_year
  games.sort((a, b) => a.release_year - b.release_year);

  // Group by decade
  const decades = {};
  games.forEach(game => {
    const decade = Math.floor(game.release_year / 10) * 10; // e.g. 1999 → 1990
    if (!decades[decade]) decades[decade] = {};
    if (!decades[decade][game.release_year]) decades[decade][game.release_year] = [];
    decades[decade][game.release_year].push(game);
  });

  // Build collapsible sections
  for (const decade in decades) {
    const decadeSection = document.createElement("div");

    const decadeHeader = document.createElement("h2");
    decadeHeader.textContent = `${decade}s`;
    decadeHeader.className = "decade-header";
    decadeHeader.style.cursor = "pointer";

    const decadeContent = document.createElement("div");
    decadeContent.style.display = "none"; // collapsed by default

    // Expand/collapse decade on click
    decadeHeader.addEventListener("click", () => {
      decadeContent.style.display =
        decadeContent.style.display === "none" ? "block" : "none";
    });

    // Inside each decade, group by year
    for (const year in decades[decade]) {
      const yearHeader = document.createElement("h3");
      yearHeader.textContent = year;
      yearHeader.style.cursor = "pointer";

      const yearContent = document.createElement("div");
      yearContent.style.display = "none";

      // Expand/collapse year on click
      yearHeader.addEventListener("click", () => {
        yearContent.style.display =
          yearContent.style.display === "none" ? "block" : "none";
      });

      decades[decade][year].forEach(game => {
        const card = createGameCard(game);
        yearContent.appendChild(card);
      });

      decadeContent.appendChild(yearHeader);
      decadeContent.appendChild(yearContent);
    }

    decadeSection.appendChild(decadeHeader);
    decadeSection.appendChild(decadeContent);
    gameList.appendChild(decadeSection);
  }

  // Open the oldest decade by default
  const firstDecadeContent = gameList.querySelector("div > div");
  if (firstDecadeContent) firstDecadeContent.style.display = "block";
}

// Create a game card (compact: icon + title/year only)
function createGameCard(game) {
  const card = document.createElement("div");
  card.className = "game-card";

  const header = document.createElement("div");
  header.className = "game-header";

  const icon = document.createElement("img");
  icon.className = "game-icon";
  icon.src = game.icon || "icons/placeholder.png";
  icon.alt = `${game.title} icon`;

  const titleSpan = document.createElement("span");
  titleSpan.textContent = `${game.title} (${game.release_year})`;

  header.appendChild(icon);
  header.appendChild(titleSpan);
  card.appendChild(header);

  // Attach click handler to open modal
  card.addEventListener("click", () => openGameModal(game));

  return card;
}

// ========== MODAL LOGIC ========== //
const modal = document.getElementById("game-modal");
const modalBody = document.getElementById("modal-body");
const closeModal = document.getElementById("close-modal");

// Open modal with game details
function openGameModal(game) {
  let detailsHTML = `
    <h2>${game.title} (${game.release_year})</h2>
    <div><strong>Status:</strong> ${game.status.replace("_", " ")}</div>
    <div><strong>Developer:</strong> ${game.developer}</div>
    <div><strong>Publisher:</strong> ${game.publisher}</div>
    ${game.end_year ? `<div><strong>End Year:</strong> ${game.end_year}</div>` : ""}
    <div><a href="${game.official_website}" target="_blank">Official Website</a></div>
  `;

  // Add servers as ASCII-style table
  if (game.servers && game.servers.length > 0) {
    detailsHTML += `
      <table class="server-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Region</th>
            <th>Ruleset</th>
            <th>Population</th>
          </tr>
        </thead>
        <tbody>
    `;
    game.servers.forEach(server => {
      detailsHTML += `
        <tr>
          <td>${server.name}</td>
          <td>${server.type}</td>
          <td>${server.region}</td>
          <td>${server.ruleset}</td>
          <td>${server.population}</td>
        </tr>
      `;
    });
    detailsHTML += `</tbody></table>`;
  }

  modalBody.innerHTML = detailsHTML;
  modal.style.display = "flex"; // show modal
}

// Close modal when clicking [X]
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Also close modal when clicking outside content
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});