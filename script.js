const LIMIT = 20;
let currentOffset = 0;
let allPokemon = [];

async function fetchPokemonList() {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${currentOffset}`;
    const response = await fetch(url);
    const data = await response.json();

    await fetchPokemonDetails(data.results);
    renderPokemonCards();
  } catch (error) {
    console.error("데이터 로딩 실패:", error);
  }
}

async function fetchPokemonDetails(results) {
  for (let i = 0; i < results.length; i++) {
    const detailResponse = await fetch(results[i].url);
    const pokemonDetail = await detailResponse.json();
    allPokemon.push(pokemonDetail);
  }
}

function renderPokemonCards() {
  const container = document.getElementById("pokedex-container");
  container.innerHTML = "";

  for (let i = 0; i < allPokemon.length; i++) {
    const pokemon = allPokemon[i];
    container.innerHTML += createPokemonCardTemplate(pokemon);
  }
}

async function loadMorePokemon() {
  currentOffset += LIMIT;
  await fetchPokemonList();
}

fetchPokemonList();