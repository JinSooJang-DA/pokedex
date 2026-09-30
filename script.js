// 1. 20마리 기본 목록(results)을 가져오는 함수 (약 8줄)
async function fetchPokemonList() {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${currentOffset}`;
    const response = await fetch(url);
    const data = await response.json();
    
    // 상세 가져오기 함수를 부르고, 끝날 때까지 기다린다!
    await fetchPokemonDetails(data.results);
  } catch (error) {
    console.error("데이터 로딩 실패:", error);
  }
}

// 2. 받은 목록으로 20마리 상세 정보를 차곡차곡 모으는 전담 함수 (약 8줄)
async function fetchPokemonDetails(results) {
  for (let i = 0; i < results.length; i++) {
    const detailResponse = await fetch(results[i].url);
    const pokemonDetail = await detailResponse.json();
    allPokemon.push(pokemonDetail);
  }
}