import React, { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import nftabi from "../constants/BasicNft.json";

const NFTCONTRACTADDRESS = "0xd0d3f00ccedb09373ff1ee3c563840f56c14e688";

function mintnft() {
  const { isWeb3Enabled, chainId, account } = useMoralis();
  const [numNft, setNumNft] = useState(0);
  const {
    runContractFunction: getBalance,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: nftabi,
    contractAddress: NFTCONTRACTADDRESS,
    functionName: "balanceOf",
    params: {
      owner: account,
    },
  });
  const handleSuccess = () => {
    console.log("Num of Nfts fetched");
  };
  useEffect(() => {
    setNumNft(0);
  }, [account]);
  return isWeb3Enabled ? (
    <div className="container mx-auto">
      <h1 className="py-4 px-4 mx-4 font-bold text-2xl">Mint NFT</h1>
      <button
        className="bg-purple-900 hover:bg-green-800 text-white font-bold py-2 px-4 rounded ml-5"
        onClick={async () => {
          var nfts = await getBalance({
            onSuccess: handleSuccess(),
            onError: (error) => console.log(error),
          });
          console.log("got number of nfts");
          setNumNft(nfts.toString());
        }}
      >
        {isLoading || isFetching ? (
          <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
        ) : (
          "Num of NFTs"
        )}
      </button>
      {numNft ? <h2> You have total of : {numNft} NFTs </h2> : ""}
    </div>
  ) : (
    <h1>Please Connect Your Wallet</h1>
  );
}

export default mintnft;
