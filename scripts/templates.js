function createPokemonCardTemplate(pokemon, secondaryClass, typesHtml) {
  return `
    <div class="pokemon-card ${pokemon.types[0].type.name}" onclick="openModal(${pokemon.id})">
      <div class="card-header">
        <h3 class="pokemon-name">${pokemon.name}</h3>
        <span class="pokemon-id">#${pokemon.id}</span>
      </div>
      <div class="card-body">
        <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}" class="pokemon-img ${secondaryClass}">
        <div class="type-container">
          ${typesHtml}
        </div>
      </div>
    </div>
  `;
}

function createSingleTypeBadgeTemplate(typeName) {
  return `<span class="pokemon-type">${typeName}</span>`;
}

function createSingleStatRowTemplate(statName, statValue, fillWidth) {
  return `
    <div class="stat-row">
      <span class="stat-name">${statName}</span>
      <span class="stat-value">${statValue}</span>
      <div class="stat-bar-bg">
        <div class="stat-bar-fill" style="width: ${fillWidth}%;"></div>
      </div>
    </div>
  `;
}

function createPokemonDetailTemplate(pokemon, secondaryClass, heightMeters, weightKg, statsHtml) {
  return `
    <div class="modal-header">
      <h2 class="modal-pokemon-name">${pokemon.name}</h2>
      <span class="modal-pokemon-id">#${pokemon.id}</span>
      <button class="close-btn" data-id="close-dialog-button" onclick="closeModal()">X</button>
    </div>
    
    <div class="modal-img-container">
      <button class="nav-btn prev-btn" data-id="prev-button" onclick="prevPokemon()">&lt;</button>
      <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}" class="modal-pokemon-img ${secondaryClass}" data-id="dialog-image">
      <button class="nav-btn next-btn" data-id="next-button" onclick="nextPokemon()">&gt;</button>
    </div>

    <div class="modal-info-box">
      <div class="modal-profile">
        <div class="profile-item">
          <span class="profile-label">Height:</span>
          <span class="profile-value">${heightMeters} m</span>
        </div>
        <div class="profile-item">
          <span class="profile-label">Weight:</span>
          <span class="profile-value">${weightKg} kg</span>
        </div>
      </div>

      <h3 class="stats-title">Base Stats</h3>
      <div class="modal-stats">
        ${statsHtml}
      </div>
    </div>
  `;
}