import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import ProfileCard from '../components/profile';
import useSWR from 'swr';
import { fetchUserPic } from '../libs/stacks/gaiahub/storage';

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Profile({address}) {

    const [profilePic, setProfilePic] = useState({selectedFile: null});
    const [token, setTokens] = useState(0);
    const { data, error } = useSWR(address? `https://stacks-node-api.testnet.stacks.co/extended/v1/address/${address}/stx`: null, fetcher, { refreshInterval: 5000 });

    useEffect(()=> {

      if (data){
        setTokens(data.balance/1000000);
      }

    }, [data]);

    useEffect(()=> {
      
      const GetUserProfilePic = async () => {

          const response = await fetchUserPic();
  
          if (response) {

            console.log(response);
            
            const objImg = Buffer.from(response).toString("base64")
  
            setProfilePic({ selectedFile: "data:image/png;base64," + objImg });

          }
      }
      
      GetUserProfilePic()
      
    }, [address]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/logo.svg" />
      </Head>

      <main className={styles.main}>
      
      <ProfileCard address={address} tokens={token} profilePic={profilePic} updateProfilePic={setProfilePic} />
        
      </main>

    </div>
  )
}