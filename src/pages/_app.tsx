import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from 'swr';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        await fetch('/api/stats/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: router.asPath }),
        });
      } catch (err) {
        // Silently fail
      }
    };

    trackVisit();
    // Track on route changes as well
    router.events.on('routeChangeComplete', trackVisit);
    return () => {
      router.events.off('routeChangeComplete', trackVisit);
    };
  }, [router]);

  return (
    <SWRConfig value={{
      fallback: pageProps.settings ? {
        '/api/settings': { success: true, data: pageProps.settings }
      } : {}
    }}>
      <Component {...pageProps} />
    </SWRConfig>
  );
}
