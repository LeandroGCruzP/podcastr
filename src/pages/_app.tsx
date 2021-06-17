/** Teoria de _app
 * Toda vez que a aplicação recarrega algum componente o _app recarrega novamente
 * para informações que se desejam carregar só uma vez se cria o _document.tsx
 */
import '../styles/global.scss'
import styles from '../styles/app.module.scss'

import Header from '../components/Header'
import Player from '../components/Player'
import { PlayerContextProvider } from '../contexts/PlayerContextProvider'

function MyApp({ Component, pageProps }) {
  return (
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContextProvider>
  )
}

export default MyApp
