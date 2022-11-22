import '../styles/globals.css'
import "@fortawesome/fontawesome-free/css/all.min.css";
import Layout from '../components/Layout'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'

import { AppConfig, UserSession } from "@stacks/connect";

const appConfig = new AppConfig(["store_write", "publish_data"]);

export var userSession = new UserSession({ appConfig });

function MyApp({ Component, pageProps }) {

  const router = useRouter()

  // page-transition effect
  useEffect(() => {
    const handleStart = (url) => {
      console.log(`Loading: ${url}`)
      NProgress.start()
    }

    const handleStop = () => {
      NProgress.done()
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStop)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
