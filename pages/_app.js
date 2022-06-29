import Ui from '../components/Ui'
import { AuthContextProvider } from '../context/Auth'
import { CampaignUploadProvider } from '../context/store'
import '../styles/globals.css'
import '../styles/Main.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <AuthContextProvider>
        <CampaignUploadProvider>
          <Ui />
          <Component {...pageProps} />
        </CampaignUploadProvider>
      </AuthContextProvider>
    </>
  )
}

export default MyApp
