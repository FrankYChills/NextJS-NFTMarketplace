import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import Header from "../components/Header";
import Head from "next/head";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.studio.thegraph.com/query/38842/nft-marketplace/v0.0.1",
});
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>NFT Marketplace</title>
        <meta name="nft-marketplace" content="Sell and Buy Nfts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <ApolloProvider client={client}>
          <Header />
          <Component {...pageProps} />
        </ApolloProvider>
      </MoralisProvider>
    </>
  );
}

export default MyApp;
