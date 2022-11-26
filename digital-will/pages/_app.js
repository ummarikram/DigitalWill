import '../styles/globals.css'
import "nprogress/nprogress.css";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import { ToastContainer } from 'react-toastify';
import Layout from '../components/Layout'
import { myStxAddress } from '../libs/stacks/auth/auth';

function MyApp({ Component, pageProps }) {

  const router = useRouter()
  const [address, setAddress] = useState(null);

  // page-transition effect
  useEffect(() => {

    setAddress(myStxAddress());

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
      <ToastContainer />
      <Component {...pageProps} address={address} />
    </Layout>
  )
}

export default MyApp
