import { GoogleOAuthProvider } from '@react-oauth/google';
import "@/styles/globals.css";
import type { AppProps } from "next/app";

// Replace with your actual Client ID!
const clientId = "YOUR_GOOGLE_CLIENT_ID_HERE";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Component {...pageProps} />
    </GoogleOAuthProvider>
  );
}
