/* Página com SSG - Static Side Generation
Você coloca um tempo onde a página vai recarregar nova informação da api que está consumindo 
assim tendo uma página estática e melhorando o performance*/

export default function Home(props) {
  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  );
}

/* Ordem execução do componente
Isto se executa primeiro ao carregar o componente */

export async function getStaticProps() {
  /* Uso de json-server
  Esta é uma API falsa que executa um json da aplicação que serve para poder simular uma API
  de verdade a través de um arquivo com extensão .json
  instalar: yarn add json-server -D 
  Ele gerá a rota http://localhost:3333/episodes onde estão todos os dados do json*/
  const response = await fetch("http://localhost:3333/episodes");
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8, // 60 segudos * 60 * 8 = A cada 8 horas se refaz a consulta a API
  };
}
