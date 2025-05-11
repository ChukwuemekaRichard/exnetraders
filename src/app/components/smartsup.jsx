// components/TawkToChat.js
import Script from 'next/script';

const TawkToChat = () => {
  return (
    <>
      <Script id="tawkto" strategy="lazyOnload">
        {`
          var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
          (function() {
            var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = 'https://embed.tawk.to/681fa64854c0c7190e826f44/1iqtq33aj';
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            s0.parentNode.insertBefore(s1, s0);
          })();
        `}
      </Script>
    </>
  );
};

export default TawkToChat;