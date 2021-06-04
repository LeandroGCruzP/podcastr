/* Teoria de _app
Toda vez que a aplicação recarrega alguma página o _app recarrega novamente
Por este motivo se cria o _document pra, por exemplo: colocar as fontes de fonts.google.com */

import "../styles/global.scss";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
