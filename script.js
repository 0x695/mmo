// === Load games dynamically from JSON ===
fetch("games.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("games-container");

    // Loop through all games in the JSON
    data.games.forEach(game => {
      // Create card container
      const card = document.createElement("div");
      card.className = "game-card";

      // Game title + release year
      const header = document.createElement("div");
      header.className = "game-header";
      header.textContent = `${game.title} (${game.release_year})`;
      card.appendChild(header);

      // Status (live/sunset/etc.)
      const status = document.createElement("div");
      status.className = `status ${game.status}`;
      status.textContent = `Status: ${game.status.replace("_", " ")}`;
      card.appendChild(status);

      // Hidden details container
      const details = document.createElement("div");
      details.className = "game-details";

      // Core info
      details.innerHTML = `
        <div><strong>Developer:</strong> ${game.developer}</div>
        <div><strong>Publisher:</strong> ${game.publisher}</div>
        ${game.end_year ? `<div><strong>End Year:</strong> ${game.end_year}</div>` : ""}
        <div><a href="${game.official_website}" target="_blank">Official Website</a></div>
        <div><strong>Servers:</strong></div>
      `;

      // Server list (loop through JSON servers)
      game.servers.forEach(server => {
        const serverDiv = document.createElement("div");
        serverDiv.className = "server";
        serverDiv.innerHTML = `
          <div><strong>${server.name}</strong> [${server.type}]</div>
          <div>Region: ${server.region}</div>
          <div>Ruleset: ${server.ruleset}</div>
          ${server.address ? `<div>Address: ${server.address}</div>` : ""}
          <div>Population: ${server.population}</div>
        `;
        details.appendChild(serverDiv);
      });

      // Attach details to card
      card.appendChild(details);

      // Toggle open/close when card is clicked
      card.addEventListener("click", () => {
        details.classList.toggle("open");
      });

      // Add card to page
      container.appendChild(card);
    });
  })
  .catch(err => {
    console.error("Failed to load games.json", err);
  });