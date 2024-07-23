// pages/_app.tsx
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import ProtectedRoute from '../components/ProtectedRoute'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ProtectedRoute>
            <Component {...pageProps} />
        </ProtectedRoute>
    )
}

export default MyApp