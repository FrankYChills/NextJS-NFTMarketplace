import React, { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import nftabi from "../constants/BasicNft.json";
import { useNotification } from "web3uikit";

const NFTCONTRACTADDRESS = "0xd0d3f00ccedb09373ff1ee3c563840f56c14e688";

function Mintnft() {
  const { isWeb3Enabled, chainId, account } = useMoralis();
  const [numNft, setNumNft] = useState(0);
  const [disable, setDisable] = useState(false);
  const dispatch = useNotification();
  const { runContractFunction: getBalance } = useWeb3Contract({
    abi: nftabi,
    contractAddress: NFTCONTRACTADDRESS,
    functionName: "balanceOf",
    params: {
      owner: account,
    },
  });
  const {
    runContractFunction: MintNFT,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: nftabi,
    contractAddress: NFTCONTRACTADDRESS,
    functionName: "mintNft",
    params: {},
  });
  async function getNum() {
    var nfts = (await getBalance()).toString();
    console.log("got number of nfts");
    setNumNft(nfts.toString());
  }
  const handleSuccess = async (tx) => {
    console.log("NFT Minted");

    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Please Refresh",
      title: "NFT Minted",
      position: "topR",
      icon: "bell",
    });
    setDisable(false);
  };
  useEffect(() => {
    if (isWeb3Enabled) {
      getNum();
    }
  }, [account, isWeb3Enabled]);
  return isWeb3Enabled ? (
    <div className="container mx-auto">
      <h1 className="py-4 px-4 ml-6 font-bold text-2xl">Mint NFT </h1>
      <button
        disabled={disable}
        className="bg-purple-900 hover:bg-green-800 text-white font-bold py-2 px-4 rounded ml-9"
        onClick={async () => {
          setDisable(true);
          await MintNFT({
            onSuccess: handleSuccess,
            onError: (error) => console.log(error),
          });
        }}
      >
        {isLoading || isFetching ? (
          <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
        ) : (
          "Mint"
        )}
      </button>
      <h2 className="text-xl font-bold ml-6 mt-4">
        {" "}
        You have total of : {numNft} NFTs{" "}
      </h2>
    </div>
  ) : (
    <h1 className="text-xl font-bold ml-8 mt-5">
      Please Connect Your Wallet To Mint an NFT
    </h1>
  );
}

export default Mintnft;
