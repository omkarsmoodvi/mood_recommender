import { GoogleOAuthProvider } from '@react-oauth/google';
import "@/styles/globals.css";
import type { AppProps } from "next/app";

const clientId = "1082391330059-guhsk7c6v9v9ab0kmdosbpmcj98aqnro.apps.googleusercontent.com";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Component {...pageProps} />
    </GoogleOAuthProvider>
  );
}
