const LIMIT = 20;
let currentOffset = 0;
let allPokemon = [];

// 1. 20마리 기본 목록 가져오기 & 완료 후 화면 그리기
async function fetchPokemonList() {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${currentOffset}`;
    const response = await fetch(url);
    const data = await response.json();
    
    await fetchPokemonDetails(data.results); // 20마리 상세 정보 수집 끝날 때까지 대기
    renderPokemonCards(); // 👈 다 모았으니 이제 화면에 그리기!
  } catch (error) {
    console.error("데이터 로딩 실패:", error);
  }
}

// 2. 20마리 상세 정보를 차곡차곡 allPokemon 배열에 담기
async function fetchPokemonDetails(results) {
  for (let i = 0; i < results.length; i++) {
    const detailResponse = await fetch(results[i].url);
    const pokemonDetail = await detailResponse.json();
    allPokemon.push(pokemonDetail);
  }
}

// 3. 카드 1개의 HTML 껍데기를 만들어주는 전담 템플릿 함수
function createPokemonCardTemplate(pokemon) {
  const imageUrl = pokemon.sprites.other["official-artwork"].front_default;

  return `
    <div class="pokemon-card">
      <span>#${pokemon.id}</span>
      <img src="${imageUrl}" alt="${pokemon.name}">
      <h3>${pokemon.name}</h3>
    </div>
  `;
}

// 4. 컨테이너를 비우고 20마리를 루프로 돌며 화면에 꽂아주는 메인 렌더 함수
function renderPokemonCards() {
  const container = document.getElementById("pokedex-container");
  container.innerHTML = "";

  for (let i = 0; i < allPokemon.length; i++) {
    const pokemon = allPokemon[i];
    container.innerHTML += createPokemonCardTemplate(pokemon);
  }
}

// 5. Load More handler
async function loadMorePokemon() {
  currentOffset += LIMIT;
  await fetchPokemonList();
}

fetchPokemonList();