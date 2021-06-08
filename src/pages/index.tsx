/* Página com SSG - Static Side Generation
Você coloca um tempo onde a página vai recarregar nova informação da api que está consumindo
assim tendo uma página estática e melhorando o performance*/
import { GetStaticProps } from 'next' // Tipagem da função getStaticProps para aplicar TS
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { api } from '../services/api'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'

interface Episodes {
  id: string
  title: string
  description: string
  thumbnail: string
  members: string
  publishedAt: string
  duration: number
  durationAsString: String
  url: string
}

interface HomeProps {
  episodes: Episodes[]
}

export default function Home(props: HomeProps) {
  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  )
}

/* Ordem execução do componente
Isto se executa primeiro ao carregar o componente */
export const getStaticProps: GetStaticProps = async () => {
  /* Uso de json-server e axios
  Esta é uma API falsa que executa um json da aplicação que serve para poder simular uma API
  de verdade a través de um arquivo com extensão .json
  instalar: yarn add json-server -D
  Ele gerá a rota http://localhost:3333/episodes onde estão todos os dados do json
  a rota pode ser trabalahda com fetch mas em esta ocasião se usou o axios que faz melhor o trabalho
  instalar: yarn add axios
  assim separamos a rota localhost em um arquivo api e podemos usar os parametros em forma de JS*/
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  /* Formatação dos dados da API
  Antes de mandar os dados pra mostrar no componente, envez de formatar eles ao momento de mostrar
  melhor é formatar apenas se faz a chamada a API */
  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      description: episode.description,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {
        locale: ptBR
      }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration)
      ),
      url: episode.file.url
    }
  })

  return {
    props: {
      episodes
    },
    revalidate: 60 * 60 * 8 // 60 segudos * 60 * 8 = A cada 8 horas se refaz a consulta a API
  }
}
