import { createContext, useContext } from 'react'

interface Episode {
  title: string
  members: string
  thumbnail: string
  duration: number
  url: string
}

interface PlayerContextData {
  currentEpisodeIndex: number
  episodeList: Episode[]
  hasNext: boolean
  hasPrevious: boolean
  isPlaying: boolean
  isLooping: boolean
  play: (episode: Episode) => void
  playList: (list: Episode[], index: number) => void
  playNext: () => void
  playPrevious: () => void
  setPlayingState: (state: boolean) => void
  togglePlay: () => void
  toggleLoop: () => void
}

export const PlayerContext = createContext({} as PlayerContextData)

/** Utilização de useContext
 * Isto faz que não seja necesário fazer 2 imports em cada componente
 * Em vez de importar useContext(PlayerContext) o unico que faz é usePlayer
 */
export const usePlayer = () => {
  return useContext(PlayerContext)
}
