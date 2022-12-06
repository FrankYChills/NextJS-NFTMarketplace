import Image from "next/image";
import { useMoralis } from "react-moralis";
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries";
import { useQuery } from "@apollo/client";
import NftBox from "../components/NftBox";

export default function Home() {
  const { chainId, isWeb3Enabled } = useMoralis();
  console.log(chainId);
  console.log(isWeb3Enabled);
  // get the data from graph
  const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS);
  return (
    <div className="container mx-auto">
      <h1 className="py-4 px-4 mx-4 font-bold text-2xl">Listed NFTs</h1>
      <div className="flex flex-wrap justify-center">
        {isWeb3Enabled ? (
          loading || !listedNfts ? (
            ""
          ) : (
            // display Nfts
            listedNfts.activeItems.map((nft) => {
              console.log(nft);
              const { price, nftAddress, tokenId, seller, id } = nft;
              return (
                <NftBox
                  price={price}
                  nftAddress={nftAddress}
                  tokenId={tokenId}
                  seller={seller}
                  key={id}
                />
              );
            })
          )
        ) : (
          <div className="text-xl font-bold ml-8 mt-4">
            Please connect your Wallet to See Listed NFTs
          </div>
        )}
      </div>
    </div>
  );
}
