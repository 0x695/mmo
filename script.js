// === Fetch JSON data and build the encyclopedia ===
fetch("games.json")
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("game-container");

    // Go through each decade
    data.decades.forEach(decade => {
      const decadeCard = document.createElement("div");
      decadeCard.className = "decade-card";

      const decadeHeader = document.createElement("div");
      decadeHeader.className = "decade-header";
      decadeHeader.textContent = `+----------------------+\n| ${decade.decade} |\n+----------------------+`;

      const yearsContainer = document.createElement("div");
      yearsContainer.style.display = "none"; // collapsed by default

      // Toggle years when decade is clicked
      decadeHeader.addEventListener("click", () => {
        yearsContainer.style.display =
          yearsContainer.style.display === "none" ? "block" : "none";
      });

      // Loop through years inside this decade
      decade.years.forEach(year => {
        const yearCard = document.createElement("div");
        yearCard.className = "year-card";

        const yearHeader = document.createElement("div");
        yearHeader.className = "year-header";
        yearHeader.textContent = `--- ${year.year} ---`;

        const gamesContainer = document.createElement("div");
        gamesContainer.style.display = "none"; // collapsed by default

        // Toggle games when year is clicked
        yearHeader.addEventListener("click", () => {
          gamesContainer.style.display =
            gamesContainer.style.display === "none" ? "block" : "none";
        });

        // Loop through games in that year
        year.games.forEach(game => {
          const gameCard = createGameCard(game);
          gamesContainer.appendChild(gameCard);
        });

        yearCard.appendChild(yearHeader);
        yearCard.appendChild(gamesContainer);
        yearsContainer.appendChild(yearCard);
      });

      decadeCard.appendChild(decadeHeader);
      decadeCard.appendChild(yearsContainer);
      container.appendChild(decadeCard);
    });

    // Open the oldest decade and year by default
    const firstDecade = container.querySelector(".decade-card div + div");
    if (firstDecade) firstDecade.style.display = "block";

    const firstYear = firstDecade?.querySelector(".year-card div + div");
    if (firstYear) firstYear.style.display = "block";
  });

// === Function to build game cards with ASCII-style details ===
function createGameCard(game) {
  const card = document.createElement("div");
  card.className = "game-card";

  const header = document.createElement("div");
  header.textContent = `${game.title} (${game.status})`;
  header.className = "game-header";

  const details = document.createElement("div");
  details.className = "game-details";
  details.style.display = "none";

  // Build servers list if any
  let serversHtml = "";
  if (game.servers && game.servers.length > 0) {
    serversHtml = `\n   === Servers ===\n`;
    game.servers.forEach(server => {
      serversHtml += `
   - ${server.name}
     Type: ${server.type}
     Region: ${server.region}
     Ruleset: ${server.ruleset}
     Population: ${server.population}
     Address: ${server.address}
`;
    });
  }

  // ASCII block of game details
  details.textContent = `
------------------------
Title: ${game.title}
Release Year: ${game.release_year}
${game.end_year ? `End Year: ${game.end_year}` : ""}
Status: ${game.status}
Developer: ${game.developer}
Publisher: ${game.publisher}
Website: ${game.official_website}
------------------------
${serversHtml}
`;

  // Toggle details on click
  header.addEventListener("click", () => {
    details.style.display = details.style.display === "none" ? "block" : "none";
  });

  card.appendChild(header);
  card.appendChild(details);
  return card;
}