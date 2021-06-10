/* Teoria de _app
Toda vez que a aplicação recarrega alguma página o _app recarrega novamente mostrando assim esas páginas
em todas telas.
Por este motivo se cria o _document pra, por exemplo: colocar as fontes de fonts.google.com */
import '../styles/global.scss'
import styles from '../styles/app.module.scss'

import Header from '../components/Header'
import Player from '../components/Player'

function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.wrapper}>
      <main>
        <Header />
        <Component {...pageProps} />
      </main>
      <Player />
    </div>
  )
}

export default MyApp
