/* Página com SSG - Static Side Generation
Você coloca um tempo onde a página vai recarregar nova informação da api que está consumindo
assim tendo uma página estática e melhorando o performance*/
import { GetStaticPaths, GetStaticProps } from 'next' // Tipagem da função getStaticProps para aplicar TS
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

import { api } from '../../services/api'

interface Episode {
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

interface EpisodeProps {
  episode: Episode
}

export default function Episode({ episode }: EpisodeProps) {
  return (
    <div>
      <h1>{episode.title}</h1>
    </div>
  )
}

// Página estatica dinamica
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

/* Ordem execução do componente
Isto se executa primeiro ao carregar o componente */
export const getStaticProps: GetStaticProps = async ctx => {
  const { slug } = ctx.params // ctx = contexto

  /* Uso de json-server e axios
  Esta é uma API falsa que executa um json da aplicação que serve para poder simular uma API
  de verdade a través de um arquivo com extensão .json
  instalar: yarn add json-server -D
  Ele gerá a rota http://localhost:3333/episodes onde estão todos os dados do json
  a rota pode ser trabalahda com fetch mas em esta ocasião se usou o axios que faz melhor o trabalho
  instalar: yarn add axios
  assim separamos a rota localhost em um arquivo api e podemos usar os parametros em forma de JS*/
  const { data } = await api.get(`/episodes/${slug}`)

  /* Formatação dos dados da API
  Antes de mandar os dados pra mostrar no componente Home, envez de formatar eles ao momento de mostrar
  melhor é formatar apenas se faz a chamada a API */
  const episode = {
    id: data.id,
    title: data.title,
    description: data.description,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
      locale: ptBR
    }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    url: data.file.url
  }

  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24 // 24 horas (refaz consulta na API)
  }
}
