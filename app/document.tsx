import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="application-name" content="CampusAxis" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="CampusAxis" />
          <meta name="description" content="Your ultimate academic portal for COMSATS University Islamabad" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#0b0b0b" />
          
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/manifest.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <link rel="shortcut icon" href="/favicon.ico" />
          
          <meta name="apple-mobile-web-app-title" content="CampusAxis" />
          <meta name="application-name" content="CampusAxis" />
          <meta name="msapplication-TileColor" content="#0b0b0b" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="theme-color" content="#0b0b0b" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').then(function(registration) {
                      console.log('SW registered: ', registration);
                    }).catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                  });
                }
              `,
            }}
          />
        </body>
      </Html>
    )
  }
}

export default MyDocument