// Load games from external JSON file
fetch("games.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("games-container");

    data.games.forEach(game => {
      // Create card
      const card = document.createElement("div");
      card.className = "game-card";

      // Header info (always visible)
      const header = document.createElement("div");
      header.className = "game-header";
      header.textContent = `${game.title} (${game.release_year})`;
      card.appendChild(header);

      const status = document.createElement("div");
      status.className = `status ${game.status}`;
      status.textContent = `Status: ${game.status.replace("_", " ")}`;
      card.appendChild(status);

      // Hidden details
      const details = document.createElement("div");
      details.className = "game-details";

      details.innerHTML = `
        <div><strong>Developer:</strong> ${game.developer}</div>
        <div><strong>Publisher:</strong> ${game.publisher}</div>
        ${game.end_year ? `<div><strong>End Year:</strong> ${game.end_year}</div>` : ""}
        <div><a href="${game.official_website}" target="_blank">Official Website</a></div>
        <div><strong>Servers:</strong></div>
      `;

      // Add server list if present
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

      card.appendChild(details);

      // Toggle details on click
      card.addEventListener("click", () => {
        details.style.display = details.style.display === "block" ? "none" : "block";
      });

      container.appendChild(card);
    });
  })
  .catch(err => {
    console.error("Failed to load games.json", err);
  });