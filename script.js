const LIMIT = 20;
let currentOffset = 0;
let allPokemon = [];
let displayedPokemon = [];
let currentPokemonIndex = 0;
let isLoading = false;

function init() {
  fetchPokemonList();
  initIntersectionObserver();
  initBackToTopButton();
  initPikachuEasterEgg();
  initRandomPokemonButton();
}

function showSpinner() {
  document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideSpinner() {
  document.getElementById('loading-spinner').classList.add('d-none');
}

async function loadPokemonApiData() {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${currentOffset}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
}

async function fetchPokemonList() {
  if (isLoading) return; 
  isLoading = true; 
  try {
    showSpinner();
    const results = await loadPokemonApiData(); 
    const newBatch = await fetchPokemonDetails(results);

    if (currentOffset === 0) {
      renderPokemonCards(newBatch);
    } else {
      renderAddedPokemon(newBatch);
    }
  } catch (error) {
    console.error("Failed to load data.:", error);
  } finally {
    hideSpinner();
    isLoading = false;
  }
}

async function fetchPokemonDetails(results) {
  const newBatch = [];

  for (let i = 0; i < results.length; i++) {
    const detailResponse = await fetch(results[i].url);
    const pokemonDetail = await detailResponse.json();
    allPokemon.push(pokemonDetail);
    newBatch.push(pokemonDetail);
  }

  return newBatch;
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

function renderAddedPokemon(newPokemonList) {
  displayedPokemon = allPokemon;
  const container = document.getElementById("pokedex-container");

  for (let i = 0; i < newPokemonList.length; i++) {
    const pokemon = newPokemonList[i];
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

function getFilteredPokemon(searchTerm) {
  const filteredPokemon = [];

  allPokemon.forEach((pokemon) => {
    if (pokemon.name.toLowerCase().includes(searchTerm)) {
      filteredPokemon.push(pokemon);
    }
  });

  return filteredPokemon;
}

function filterPokemon() {
  const searchPokemonName = document.getElementById('search-input').value.toLowerCase();

  if (searchPokemonName.length === 0) {
    toggleLoadMoreButton("");
    return renderPokemonCards(allPokemon);
  }
  if (searchPokemonName.length < 3) return;

  const filteredPokemon = getFilteredPokemon(searchPokemonName);

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

function getModalRenderData(pokemon) {
  return {
    height: (pokemon.height / 10).toFixed(1),
    weight: (pokemon.weight / 10).toFixed(1),
    statsHtml: buildPokemonStatsHtml(pokemon.stats),
    shadowClass: getSecondaryShadowClass(pokemon, 'shadow-modal-'),
  };
}

function updatePokemonModal() {
  const pokemon = displayedPokemon[currentPokemonIndex];
  if (!pokemon) return;

  const data = getModalRenderData(pokemon);
  const primaryType = pokemon.types[0].type.name;

  document.querySelector(".modal-content").className = `modal-content ${primaryType}`;
  document.getElementById("modal-body").innerHTML = createPokemonDetailTemplate(
    pokemon, data.shadowClass, data.height, data.weight, data.statsHtml
  );
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

function initIntersectionObserver() {
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

  setupAutoToggleListener(autoToggle, loadBtn);
}

function setupAutoToggleListener(autoToggle, loadBtn) {
  if (!autoToggle) return;

  autoToggle.addEventListener("change", () => {
    if (autoToggle.checked && loadBtn) {
      const rect = loadBtn.getBoundingClientRect();
      if (rect.top < window.innerHeight && !isLoading) {
        loadMorePokemon();
      }
    }
  });
}

function initBackToTopButton() {
  const backToTopBtn = document.getElementById("back-to-top-btn");
  if (!backToTopBtn) return;

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

function triggerPikachuSurprise(giantPika) {
  const pikaSound = new Audio("./assets/sounds/pikachu_scream.mp3");
  pikaSound.volume = 0.4;
  pikaSound.play().catch(() => {});

  giantPika.classList.add("show");
  setTimeout(() => {
    giantPika.classList.remove("show");
  }, 1500);
}

function initPikachuEasterEgg() {
  const btnA = document.getElementById("btn-top");
  const giantPika = document.getElementById("giant-pikachu");

  if (btnA && giantPika) {
    btnA.addEventListener("click", () => triggerPikachuSurprise(giantPika));
  }
}

function closeGiantPikachu() {
  const giantPika = document.getElementById("giant-pikachu");
  if (giantPika) giantPika.classList.remove("show");
}

function playPokemonCenterSound() {
  const centerSound = new Audio("./assets/sounds/pkmncenter.mp3");
  centerSound.volume = 0.5;
  centerSound.play().catch(() => {});
}

function openRandomPokemonModal() {
  if (displayedPokemon.length === 0) return;

  const randomIndex = Math.floor(Math.random() * displayedPokemon.length);
  const chosenPokemon = displayedPokemon[randomIndex];
  openModal(chosenPokemon.id);
}

function initRandomPokemonButton() {
  const btnB = document.getElementById("btn-sound");
  if (!btnB) return;

  btnB.addEventListener("click", () => {
    playPokemonCenterSound();
    openRandomPokemonModal();
  });
}