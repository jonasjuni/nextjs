import '../styles/globals.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {

  console.log('Node Variable:', process.env.TEST_NODE_VARIABLE);
  console.log('Browser Variable:', process.env.NEXT_PUBLIC_BROWSER_VARIABLE);

  return <Component {...pageProps} />
}

export default MyApp
