/** Página com Static Side Generation (SSG)
 * Se seta um tempo especifico que a página buscará nova informação na API
 * durante ese tempo a página ficará estática para todos os usuarios
 */
/** Extensões
 * -- date-fns --
 * yarn add date-fns
 * documentação: https://date-fns.org/v2.22.1/docs/format
 */
import { GetStaticPaths, GetStaticProps } from 'next' // Tipagem da função getStaticProps para aplicar TS
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

import Image from 'next/image' // Define: altura * largura que vai carregar a imagem
import Link from 'next/link' // Aplica o conceito SPA (Single Page Aplication) no href

import { api } from '../../services/api'
import styles from './episode.module.scss'

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
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={350}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button type="button">
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
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

/** Aplicando SSG
 * Isto se executa primeiro ao carregar o componente
 */
export const getStaticProps: GetStaticProps = async ctx => {
  const { slug } = ctx.params // ctx = contexto
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
  const { data } = await api.get(`/episodes/${slug}`)
  /** Formatação dos dados da API
   * Antes de mandar os dados pra mostrar no componente Home se formatam
   * apenas se faz a chamada a API
   */
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
