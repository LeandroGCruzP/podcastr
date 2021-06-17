import { createContext } from 'react'

interface Episode {
  title: string
  members: string
  thumbnail: string
  duration: number
  url: string
}

interface PlayerContextData {
  episodeList: Episode[]
  currentEpisodeIndex: number
  play: (episode: Episode) => void
  isPlaying: boolean
  playList: (list: Episode[], index: number) => void
  togglePlay: () => void
  setPlayingState: (state: boolean) => void
  hasNext: boolean
  hasPrevious: boolean
  playNext: () => void
  playPrevious: () => void
}

export const PlayerContext = createContext({} as PlayerContextData)
