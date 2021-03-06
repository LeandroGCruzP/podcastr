/** Página com Static Side Generation (SSG)
 * Se seta um tempo especifico que a página buscará nova informação na API
 * durante ese tempo a página ficará estática para todos os usuarios
 */
/** Extensões
 * -- date-fns --
 * yarn add date-fns
 * documentação: https://date-fns.org/v2.22.1/docs/format
 */
import { GetStaticProps } from 'next' // Tipagem da função getStaticProps para aplicar TS
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import Image from 'next/image' // Define: altura * largura que vai carregar a imagem
import Link from 'next/link' // Aplica o conceito SPA (Single Page Aplication) no href
import Head from 'next/Head' // Coloca o titulo na página

import { usePlayer } from '../contexts/PlayerContext'
import { api } from '../services/api'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'
import styles from './home.module.scss'

interface Episodes {
  id: string
  title: string
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
  const { playList } = usePlayer()

  // latestEpisodes: Ultimos 2 episódios que estão em cima
  // allEpisodes: Todos os episódios que estão em baixo para reproduzir
  const episodeList = [...latestEpisodes, ...allEpisodes] // Todos os episódios que se tem em uma única lista

  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>

      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map((episode, index) => {
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
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playList(episodeList, index)
                  }}
                >
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
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
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
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        playList(episodeList, index + latestEpisodes.length)
                      }
                    >
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

/** Aplicando SSG
 * Isto se executa primeiro ao carregar o componente
 */
export const getStaticProps: GetStaticProps = async () => {
  /** Usando json-server e axios
   * -- json-server
   * Esta é uma API falsa que executa um json da aplicação que serve para poder simular uma API
   * a través de um arquivo com extensão .json
   * instalar: yarn add json-server -D
   * Ele gerá a rota http://localhost:3333/episodes onde estão todos os dados do json
   * Para iniciar o json-server se deve establecer no package.json um script
   * "scripts": {
   *   "server": "json-server server.json -w -d 750 -p 3333"
   * }
   * -- axios --
   * Se utiliza axios no lugar do fetch para utilizar parametros JS e por sua flexibilidade
   * instalar: yarn add axios
   * O local onde se encontra a api está dentro do arquivo '/services/api'
   */
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  /** Formatação dos dados da API
   * Antes de mandar os dados pra mostrar no componente Home se formatam
   * apenas se faz a chamada a API
   */
  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
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
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8 // 8 Horas (refaz consulta na API)
  }
}
