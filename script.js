const LIMIT = 20;
let currentOffset = 0;
let allPokemon = [];

async function fetchPokemonList() {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${currentOffset}`;
    const response = await fetch(url);
    const data = await response.json();

    await fetchPokemonDetails(data.results);
    renderPokemonCards(allPokemon);
  } catch (error) {
    console.error("Failed to load data.:", error);
  }
}

async function fetchPokemonDetails(results) {
  for (let i = 0; i < results.length; i++) {
    const detailResponse = await fetch(results[i].url);
    const pokemonDetail = await detailResponse.json();
    allPokemon.push(pokemonDetail);
  }
}

function renderPokemonCards(pokemonList) {
  const container = document.getElementById("pokedex-container");
  container.innerHTML = "";

  for (let i = 0; i < pokemonList.length; i++) {
    const pokemon = pokemonList[i];
    container.innerHTML += createPokemonCardTemplate(pokemon);
  }
}

async function loadMorePokemon() {
  currentOffset += LIMIT;
  await fetchPokemonList();
}

function filterPokemon() {
  let searchPokemonName = document.getElementById('search-input').value.toLowerCase();
  let filteredPokemon = [];

  for (let i = 0; i < allPokemon.length; i++) {
    let pokemon = allPokemon[i];
    
    if (pokemon.name.toLowerCase().includes(searchPokemonName)) {
      filteredPokemon.push(pokemon);
    }
  }

  renderPokemonCards(filteredPokemon);
}

fetchPokemonList();