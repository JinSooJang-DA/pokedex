const LIMIT = 20;
let currentOffset = 0;
let allPokemon = [];

async function fetchPokemonList() {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${currentOffset}`);
    const data = await response.json();

    for (let i = 0; i < data.results.length; i++) {
      const pokemon = data.results[i];
      const detailResponse = await fetch(pokemon.url);
      const pokemonDetail = await detailResponse.json();
      allPokemon.push(pokemonDetail);
    }

    console.log("20마리 가져오기 완료:", allPokemon);
  } catch (error) {
    console.error("데이터를 가져오는 중 오류 발생:", error);
  }
}

// 브라우저가 열리면 바로 테스트할 수 있도록 함수 호출!
fetchPokemonList();