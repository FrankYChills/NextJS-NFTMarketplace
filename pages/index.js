import Image from "next/image";
import { useMoralis } from "react-moralis";
import styles from "../styles/Home.module.css";
import networkMapping from "../constants/networkMapping.json";
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries";
import { useQuery } from "@apollo/client";
import NftBox from "../components/NftBox";

export default function Home() {
  const { chainId, isWeb3Enabled } = useMoralis;
  const chainString = chainId ? parseInt(chainId).toString() : "31337";
  const marketplaceAddress = networkMapping[chainString][0];
  // get the data from graph
  const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS);
  return (
    <div className="container mx-auto">
      <h1 className="py-4 px-4 mx-4 font-bold text-2xl">Listed NFTs</h1>
      <div className="flex flex-wrap">
        {isWeb3Enabled ? (
          loading || !listedNfts ? (
            <div>Loading ...</div>
          ) : (
            // display Nfts
            listedNfts.activeItems.map((nft) => {
              console.log(nft);
              const { price, nftAddress, tokenId, seller } = nft;
              return (
                <NftBox
                  price={price}
                  nftAddress={nftAddress}
                  tokenId={tokenId}
                  seller={seller}
                />
              );
            })
          )
        ) : (
          <div>Please connect your Wallet to Start</div>
        )}
      </div>
    </div>
  );
}
