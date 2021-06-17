import { ReactNode, useState } from 'react'
import { PlayerContext } from './PlayerContext'

interface Episode {
  title: string
  members: string
  thumbnail: string
  duration: number
  url: string
}

interface PlayerContextProvider {
  children: ReactNode
}

export function PlayerContextProvider({ children }: PlayerContextProvider) {
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  /** Descrição:
   * Função para seleccioar um episódio e colocar para reprodução
   */
  function play(episode: Episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  /** Descrição:
   * Função para pegar uma lista de episódios e colocar um index em cada episódio,
   * assim consegue voltar para música anterior ou avançar para a próxima música.
   */
  function playList(list: Episode[], index: number) {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  /** Descrição:
   * Função para conseguir dar play ou pausar reprodução do episódio
   */
  function togglePlay() {
    setIsPlaying(!isPlaying)
  }

  /** Descrição:
   * Função para conseguir pegar o estado da reprodução e dar play ou pausar
   * em conjunto com o comando de teclado (F7)
   */
  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }

  /** Descrição:
   * Função para tocar a próxima música
   */
  function playNext() {
    if (currentEpisodeIndex > 0) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }

  /** Descrição:
   * Função para tocar música anterior
   */
  function playPreview() {
    const nextEpisodeIndex = currentEpisodeIndex + 1

    if (nextEpisodeIndex < episodeList.length) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        playList,
        isPlaying,
        togglePlay,
        setPlayingState,
        playNext,
        playPreview
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}