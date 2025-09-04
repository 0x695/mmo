// Load JSON and render games grouped by decade → year → game
fetch("games.json")
  .then(response => response.json())
  .then(data => {
    renderGames(data);
  });

// Render function
function renderGames(data) {
  const gameList = document.getElementById("game-list");

  // Group by decade and year
  const decades = {};
  data.forEach(game => {
    const year = game.release_year;
    const decade = Math.floor(year / 10) * 10;

    if (!decades[decade]) decades[decade] = {};
    if (!decades[decade][year]) decades[decade][year] = [];

    decades[decade][year].push(game);
  });

  // Sort decades and years
  const sortedDecades = Object.keys(decades).sort((a, b) => a - b);

  sortedDecades.forEach(decade => {
    // Create decade card
    const decadeCard = document.createElement("div");
    decadeCard.className = "decade-card";

    const decadeHeader = document.createElement("div");
    decadeHeader.textContent = `${decade}s`;
    decadeHeader.className = "decade-header";

    const decadeContent = document.createElement("div");
    decadeContent.style.display = (decade === sortedDecades[0] ? "block" : "none");

    decadeHeader.addEventListener("click", () => {
      decadeContent.style.display =
        decadeContent.style.display === "none" ? "block" : "none";
    });

    // Years inside this decade
    const sortedYears = Object.keys(decades[decade]).sort((a, b) => a - b);
    sortedYears.forEach(year => {
      const yearCard = document.createElement("div");
      yearCard.className = "year-card";

      const yearHeader = document.createElement("div");
      yearHeader.textContent = year;
      yearHeader.className = "year-header";

      const yearContent = document.createElement("div");
      yearContent.style.display = "none";

      yearHeader.addEventListener("click", () => {
        yearContent.style.display =
          yearContent.style.display === "none" ? "block" : "none";
      });

      // Add games inside this year
      decades[decade][year].forEach(game => {
        const card = createGameCard(game);
        yearContent.appendChild(card);
      });

      yearCard.appendChild(yearHeader);
      yearCard.appendChild(yearContent);
      decadeContent.appendChild(yearCard);
    });

    decadeCard.appendChild(decadeHeader);
    decadeCard.appendChild(decadeContent);
    gameList.appendChild(decadeCard);
  });
}

// Create individual game card
function createGameCard(game) {
  const card = document.createElement("div");
  card.className = "game-card";
  card.textContent = `${game.title} (${game.status})`;

  card.addEventListener("click", () => showGameModal(game));
  return card;
}

// Show game details in popup modal
function showGameModal(game) {
  const modal = document.getElementById("gameModal");
  const modalBody = document.getElementById("modalBody");

  let serversHtml = "";
  if (game.servers && game.servers.length > 0) {
    serversHtml = "<h3>Servers:</h3><ul>";
    game.servers.forEach(server => {
      serversHtml += `<li>${server.name} (${server.type}, ${server.region}) - ${server.ruleset} - ${server.address} [${server.population}]</li>`;
    });
    serversHtml += "</ul>";
  }

  modalBody.innerHTML = `
    <h2>${game.title}</h2>
    <p><b>Release Year:</b> ${game.release_year}</p>
    ${game.end_year ? `<p><b>End Year:</b> ${game.end_year}</p>` : ""}
    <p><b>Status:</b> ${game.status}</p>
    <p><b>Developer:</b> ${game.developer}</p>
    <p><b>Publisher:</b> ${game.publisher}</p>
    <p><a href="${game.official_website}" target="_blank">Official Website</a></p>
    ${serversHtml}
  `;

  modal.style.display = "block";

  document.getElementById("modalClose").onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = event => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}