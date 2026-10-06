const LIMIT = 20;
let currentOffset = 0;
let allPokemon = [];
let displayedPokemon = [];
let currentPokemonIndex = 0;

function init() {
  fetchPokemonList();
}

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

function getSecondaryShadowClass(pokemon, prefix = 'shadow-') {
  if (pokemon.types.length > 1) {
    return `${prefix}${pokemon.types[1].type.name}`;
  }
  return '';
}

function buildPokemonTypesHtml(types) {
  let typesHtml = '';
  for (let i = 0; i < types.length; i++) {
    typesHtml += createSingleTypeBadgeTemplate(types[i].type.name);
  }
  return typesHtml;
}

function buildPokemonStatsHtml(stats) {
  let statsHtml = '';
  for (let i = 0; i < 3; i++) {
    const statName = stats[i].stat.name;
    const statValue = stats[i].base_stat;
    const fillWidth = Math.min(statValue, 100);
    statsHtml += createSingleStatRowTemplate(statName, statValue, fillWidth);
  }
  return statsHtml;
}

function renderPokemonCards(pokemonList) {
  displayedPokemon = pokemonList;
  const container = document.getElementById("pokedex-container");
  container.innerHTML = "";

  for (let i = 0; i < pokemonList.length; i++) {
    const pokemon = pokemonList[i];
    const secondaryClass = getSecondaryShadowClass(pokemon, 'shadow-');
    const typesHtml = buildPokemonTypesHtml(pokemon.types);

    container.innerHTML += createPokemonCardTemplate(pokemon, secondaryClass, typesHtml);
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

  if (searchPokemonName.length === 0) {
    toggleLoadMoreButton("");
    return renderPokemonCards(allPokemon);
  }
  if (searchPokemonName.length < 3) return;

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
  modal.close();
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
  modal.showModal();

  updatePokemonModal();
}

function handleBackdropClick(event) {
  const modal = document.getElementById('pokemon-modal');
  if (event.target === modal) {
    closeModal();
  }
}

function updatePokemonModal() {
  const pokemon = displayedPokemon[currentPokemonIndex];
  if (!pokemon) return;

  const modalBody = document.getElementById('modal-body');
  const modalContent = document.querySelector('.modal-content');
  const primaryType = pokemon.types[0].type.name;

  const secondaryClass = getSecondaryShadowClass(pokemon, 'shadow-modal-');
  const heightMeters = (pokemon.height / 10).toString();
  const weightKg = (pokemon.weight / 10).toString();
  const statsHtml = buildPokemonStatsHtml(pokemon.stats);

  modalContent.className = `modal-content ${primaryType}`;
  modalBody.innerHTML = createPokemonDetailTemplate(pokemon, secondaryClass, heightMeters, weightKg, statsHtml);
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