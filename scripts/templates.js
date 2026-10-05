function createPokemonCardTemplate(pokemon, index) {
  const imageUrl = pokemon.sprites.other["official-artwork"].front_default;
  const primaryType = pokemon.types[0].type.name;

  return `
    <div class="pokemon-card ${primaryType}" onclick="openModal(${pokemon.id})">
      <div class="card-header">
        <span class="pokemon-id">#${pokemon.id}</span>
        <h3 class="pokemon-name">${pokemon.name}</h3>
      </div>
      <div class="card-body">
        <img src="${imageUrl}" alt="${pokemon.name}" class="pokemon-img">
        <div class="type-container">
          <span class="pokemon-type">${primaryType}</span>
        </div>
      </div>
    </div>
  `;
}

function createPokemonStatsTemplate(pokemon) {
  let statsHtml = "";

  // for (let i = 0; i < pokemon.stats.length; i++) {
  for (let i = 0; i < 3; i++) {
    const stat = pokemon.stats[i];
    const statName = stat.stat.name;
    const statValue = stat.base_stat;
    const fillWidth = Math.min(statValue, 100);

    statsHtml += `
      <div class="stat-row">
        <span class="stat-name">${statName}</span>
        <span class="stat-value">${statValue}</span>
        <div class="stat-bar-bg">
          <div class="stat-bar-fill" style="width: ${fillWidth}%;"></div>
        </div>
      </div>
    `;
  }

  return statsHtml;
}

function createPokemonDetailTemplate(pokemon) {
  const imageUrl = pokemon.sprites.other["official-artwork"].front_default;
  const primaryType = pokemon.types[0].type.name;

  return `
    <div class="modal-header">
      <span class="modal-pokemon-id">#${pokemon.id}</span>
      <h2 class="modal-pokemon-name">${pokemon.name}</h2>
    </div>
    
    <div class="modal-img-container">
      <button class="nav-btn prev-btn" onclick="prevPokemon()">&lt;</button>
      <img src="${imageUrl}" alt="${pokemon.name}" class="modal-pokemon-img">
      <button class="nav-btn next-btn" onclick="nextPokemon()">&gt;</button>
    </div>

    <div class="modal-info-box">
      <div class="modal-profile">
        <div class="profile-item">
          <span class="profile-label">Height:</span>
          <span class="profile-value">${pokemon.height / 10} m</span>
        </div>
        <div class="profile-item">
          <span class="profile-label">Weight:</span>
          <span class="profile-value">${pokemon.weight / 10} kg</span>
        </div>
      </div>

      <h3 class="stats-title">Base Stats</h3>
      <div class="modal-stats">
        ${createPokemonStatsTemplate(pokemon)}
      </div>
    </div>
  `;
}