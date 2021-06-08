import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'

import styles from './styles.module.scss'

export default function Header() {
  /* Formatando a data
  Para formatar a data se ocupará o pacote "date-fns"
  e o formato escolhido foi a través da documentação do proprio date-fns/format
  instalar: yarn add date-fns
  link: https://date-fns.org/v2.22.1/docs/format*/
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
