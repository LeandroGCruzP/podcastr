/* Página com SSG - Static Side Generation
Você coloca um tempo onde a página vai recarregar nova informação da api que está consumindo
assim tendo uma página estática e melhorando o performance*/
import { GetStaticProps } from 'next' // Tipagem da função getStaticProps para aplicar TS
import Image from 'next/image' // Ajuda a setar a altura e largura que vai carregar a aplicação, não o que vai mostrar
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { api } from '../services/api'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'

import styles from './home.module.scss'

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
  latestEpisodes: Episodes[]
  allEpisodes: Episodes[]
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <a href="">{episode.title}</a>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
          </thead>
          <tbody>
            {allEpisodes.map(episode => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <a href="">{episode.title}</a>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
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

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(0, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8 // 60 segudos * 60 * 8 = A cada 8 horas se refaz a consulta a API
  }
}
