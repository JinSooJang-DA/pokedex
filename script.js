const LIMIT = 20;
let currentOffset = 0;
let allPokemon = [];
let displayedPokemon = [];
let currentPokemonIndex = 0;
let isLoading = false;

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
  if (isLoading) return; 
  isLoading = true; 
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
    isLoading = false;
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

const autoToggle = document.getElementById("auto-scroll-toggle");
const loadBtn = document.getElementById("load-more-btn");

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !isLoading && autoToggle && autoToggle.checked) {
      loadMorePokemon();
    }
  });
}, { threshold: 0.1 });

if (loadBtn) {
  scrollObserver.observe(loadBtn);
}

if (autoToggle) {
  autoToggle.addEventListener("change", () => {
    if (autoToggle.checked && loadBtn) {
      const rect = loadBtn.getBoundingClientRect();
        if (rect.top < window.innerHeight && !isLoading) {
        loadMorePokemon();
      }
    }
  });
}

const backToTopBtn = document.getElementById("back-to-top-btn");

if (backToTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const btnA = document.getElementById("btn-top");
const giantPika = document.getElementById("giant-pikachu");

if (btnA && giantPika) {
  btnA.addEventListener("click", () => {
    const pikaSound = new Audio("./assets/sounds/pikachu_scream.mp3");
    pikaSound.volume = 0.4; 
    pikaSound.play().catch(() => {});

    giantPika.classList.add("show");

    setTimeout(() => {
      giantPika.classList.remove("show");
    }, 1500);
  });
}

function closeGiantPikachu() {
  if (giantPika) giantPika.classList.remove("show");
}

const btnB = document.getElementById("btn-sound");

if (btnB) {
  btnB.addEventListener("click", () => {
    if (displayedPokemon.length === 0) return;

    const centerSound = new Audio("./assets/sounds/pkmncenter.mp3");
    centerSound.volume = 0.5;
    centerSound.play().catch(() => {});

    const randomIndex = Math.floor(Math.random() * displayedPokemon.length);
    const chosenPokemon = displayedPokemon[randomIndex];

    openModal(chosenPokemon.id);
  });
}