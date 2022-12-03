import { useState, useEffect } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import nftabi from "../constants/BasicNft.json";

function NftBox({ price, nftAddress, tokenId, seller }) {
  const { isWeb3Enabled, account } = useMoralis;
  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokendes, setTokendes] = useState("");

  //running contract functions
  const { runContractFunction: getTokenURI } = useWeb3Contract({
    contractAddress: nftAddress,
    abi: nftabi,
    functionName: "tokenURI",
    params: {
      tokenId: tokenId,
    },
  });

  async function updateUI() {
    const tokenURI = await getTokenURI();
    // tokenURI is the location of json file
    console.log(`Token URI of token ${tokenId} is ${tokenURI}`);
    if (tokenURI) {
      // IPFS Gateway: A server that will return IPFS files from a "normal" URL.
      const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs");
      const tokenURIResponse = await (await fetch(requestURL)).json();
      const imageURI = tokenURIResponse.image;
      const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs");
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
      <div>{}</div>
    </div>
  );
}

export default NftBox;
