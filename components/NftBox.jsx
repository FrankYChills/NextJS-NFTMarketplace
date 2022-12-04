import { useState, useEffect } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import nftabi from "../constants/BasicNft.json";
import { Card } from "web3uikit";
import Image from "next/image";

function NftBox({ price, nftAddress, tokenId, seller }) {
  const { isWeb3Enabled, account } = useMoralis();
  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokendes, setTokendes] = useState("");

  //running contract functions
  const { runContractFunction: getTokenURI } = useWeb3Contract({
    abi: nftabi,
    contractAddress: nftAddress,

    functionName: "tokenURI",
    params: {
      tokenId: tokenId,
    },
  });

  async function updateUI() {
    console.log(typeof tokenId);
    const tokenURI = (await getTokenURI()).toString();

    // tokenURI is the location of json file
    console.log(`Token URI of token ${tokenId} is ${tokenURI}`);
    if (tokenURI) {
      // IPFS Gateway: A server that will return IPFS files from a "normal" URL.
      const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      const tokenURIResponse = await (await fetch(requestURL)).json();

      console.log(tokenURIResponse);

      const imageURI = tokenURIResponse.image;
      const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      setImageURI(imageURIURL);
      setTokenName(tokenURIResponse.name);
      setTokendes(tokenURIResponse.description);
    }
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, []);
  return (
    <div>
      <div>
        {imageURI ? (
          <div>
            <Card title={tokenName} description={tokendes} />
            <div className="p-2">
              <div className="flex flex-col items-end gap-2">
                <div>#{tokenId}</div>
                <div className="italic text-sm">Owned by {seller}</div>
                <Image
                  loader={() => imageURI}
                  src={imageURI}
                  height="200"
                  width="200"
                />
                <div className="font-bold">{price / 1e18} ETH</div>
              </div>
            </div>
          </div>
        ) : (
          <div>Loading ...</div>
        )}
      </div>
    </div>
  );
}

export default NftBox;
