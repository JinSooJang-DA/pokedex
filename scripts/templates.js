function createPokemonCardTemplate(pokemon) {
  const imageUrl = pokemon.sprites.other["official-artwork"].front_default;
  const primaryType = pokemon.types[0].type.name;

  return `
    <div class="pokemon-card ${primaryType}">
      <span class="pokemon-id">#${pokemon.id}</span>
      <img src="${imageUrl}" alt="${pokemon.name}">
      <h3>${pokemon.name}</h3>
      <span class="pokemon-type">${primaryType}</span>
    </div>
  `;
}