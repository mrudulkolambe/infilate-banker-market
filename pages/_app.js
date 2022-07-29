import { useState } from 'react'
import Ui from '../components/Ui'
import { AuthContextProvider } from '../context/Auth'
import { CampaignUploadProvider } from '../context/store'
import '../styles/globals.css'
import '../styles/Main.css'

function MyApp({ Component, pageProps }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <AuthContextProvider>
        <CampaignUploadProvider>
          <Ui show={show} setShow={setShow}/>
          <Component {...pageProps} />
        </CampaignUploadProvider>
      </AuthContextProvider>
    </>
  )
}

export default MyApp
