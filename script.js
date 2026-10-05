const LIMIT = 20;
let currentOffset = 0;
let allPokemon = [];
let displayedPokemon = [];
let currentPokemonIndex = 0;

function showSpinner() {
  document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideSpinner() {
  document.getElementById('loading-spinner').classList.add('d-none');
}

async function fetchPokemonList() {
  try {
    showSpinner();
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${currentOffset}`;
    const response = await fetch(url);
    const data = await response.json();

    await fetchPokemonDetails(data.results);
    renderPokemonCards(allPokemon);
  } catch (error) {
    console.error("Failed to load data.:", error);
  } finally {
    hideSpinner();
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
  displayedPokemon = pokemonList;
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

function toggleLoadMoreButton(searchTerm) {
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (searchTerm.length > 0) {
    loadMoreBtn.classList.add('d-none');
  } else {
    loadMoreBtn.classList.remove('d-none');
  }
}

function filterPokemon() {
  const searchPokemonName = document.getElementById('search-input').value.toLowerCase();
  const filteredPokemon = [];

  for (let i = 0; i < allPokemon.length; i++) {
    const pokemon = allPokemon[i];
    if (pokemon.name.toLowerCase().includes(searchPokemonName)) {
      filteredPokemon.push(pokemon);
    }
  }

  toggleLoadMoreButton(searchPokemonName);
  renderPokemonCards(filteredPokemon);
}

function closeModal() {
  document.body.classList.remove('no-scroll');

  const modal = document.getElementById('pokemon-modal');
  modal.classList.add('d-none');
}

function openModal(id) {
  document.body.classList.add('no-scroll');

  for (let i = 0; i < displayedPokemon.length; i++) {
    if (displayedPokemon[i].id === id) {
      currentPokemonIndex = i;
      break;
    }
  }

  const modal = document.getElementById('pokemon-modal');
  modal.classList.remove('d-none');

  updatePokemonModal();
}

function updatePokemonModal() {
  const pokemon = displayedPokemon[currentPokemonIndex];
  if (!pokemon) return;

  const modalBody = document.getElementById('modal-body');
  const modalContent = document.querySelector('.modal-content');
  const primaryType = pokemon.types[0].type.name;

  modalContent.className = `modal-content ${primaryType}`;
  modalBody.innerHTML = createPokemonDetailTemplate(pokemon);
}

function nextPokemon() {
  if (currentPokemonIndex === displayedPokemon.length - 1) {
    currentPokemonIndex = 0;
  } else {
    currentPokemonIndex = currentPokemonIndex + 1;
  }
  updatePokemonModal();
}

function prevPokemon() {
  if (currentPokemonIndex === 0) {
    currentPokemonIndex = displayedPokemon.length - 1;
  } else {
    currentPokemonIndex = currentPokemonIndex - 1;
  }
  updatePokemonModal();
}

fetchPokemonList();