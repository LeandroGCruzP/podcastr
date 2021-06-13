/** Extensões
 * -- date-fns --
 * yarn add date-fns
 * documentação: https://date-fns.org/v2.22.1/docs/format
 */
import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'

import styles from './styles.module.scss'

export default function Header() {
  /** Formatando a data
   * Formatando a data com "date-fns/format"
   * o formato selecionado se encontra na documentação.
   */
  const currentDate = format(new Date(), 'EEEEEE, d MMM', {
    locale: ptBR // idioma da data selecionada
  })

  return (
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="Podcastr" />

      <p>O melhor para você ouvir, sempre</p>

      <span>{currentDate}</span>
    </header>
  )
}
