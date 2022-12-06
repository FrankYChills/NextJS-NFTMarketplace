import { useState, useEffect } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import nftabi from "../constants/BasicNft.json";
import marketplaceAbi from "../constants/NftMarketplace.json";
import { Card, useNotification } from "web3uikit";
import Image from "next/image";
import UpdateListing from "./UpdateListing";
import networkMapping from "../constants/networkMapping.json";

function NftBox({ price, nftAddress, tokenId, seller }) {
  const { isWeb3Enabled, account, chainId } = useMoralis();
  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokendes, setTokendes] = useState("");
  const [showModal, setShowModal] = useState(false);
  const dispatch = useNotification();
  const hideModal = () => setShowModal(false);

  const chainString = chainId ? parseInt(chainId).toString() : "5";
  const marketplaceAddress = networkMapping[chainString][0];
  console.log(marketplaceAddress);
  console.log(marketplaceAbi);

  //running contract functions
  const { runContractFunction: getTokenURI } = useWeb3Contract({
    abi: nftabi,
    contractAddress: nftAddress,

    functionName: "tokenURI",
    params: {
      tokenId: tokenId,
    },
  });

  const { runContractFunction: purchaseNft } = useWeb3Contract({
    abi: marketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "buyItem",
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
    },
    msgValue: price,
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
  const truncateStr = (fullStr, strLen) => {
    // strLen is stotal length of character to show (including ...)
    if (fullStr.length <= strLen) {
      return fullStr;
    }
    const separator = "....";
    const separatorLength = separator.length;
    const charsToShow = strLen - separatorLength;
    //ceil - 2.6 = 3
    const frontChars = Math.ceil(charsToShow / 2);
    //floor - 2.6 = 2
    const backChars = Math.floor(charsToShow / 2);
    return (
      fullStr.substring(0, frontChars) +
      separator +
      fullStr.substring(fullStr.length - backChars)
    );
  };
  const isOwnedByUser = seller === account;
  const formattedSellerAccount = isOwnedByUser
    ? "You"
    : truncateStr(seller, 15);
  const handleCardClick = () => {
    isOwnedByUser
      ? setShowModal(true)
      : purchaseNft({
          onError: (error) => console.log(error),
          onSuccess: (tx) => handleBuyItemSuccess(tx),
        });
  };
  const handleBuyItemSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Please refresh",
      title: "Nft Bought!",
      position: "topR",
    });
  };
  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);
  return (
    <div className="ml-3">
      <div>
        {imageURI ? (
          <div>
            <UpdateListing
              isVisible={showModal}
              onClose={hideModal}
              marketplaceAddress={marketplaceAddress}
              marketplaceAbi={marketplaceAbi}
              nftAddress={nftAddress}
              tokenId={tokenId}
            />
            <Card
              title={tokenName}
              description={tokendes}
              onClick={handleCardClick}
            >
              <div className="p-2">
                <div className="flex flex-col items-end gap-2">
                  <div>#{tokenId}</div>
                  <div className="italic text-sm">
                    Owned by {formattedSellerAccount}
                  </div>
                  <Image
                    loader={() => imageURI}
                    src={imageURI}
                    height="200"
                    width="200"
                  />
                  <div className="font-bold">{price / 1e18} ETH</div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default NftBox;
