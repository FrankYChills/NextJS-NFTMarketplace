import { useState } from "react";
import styles from "../styles/Home.module.css";
import { Form, useNotification } from "web3uikit";
import { useMoralis, useWeb3Contract } from "react-moralis";
import nftabi from "../constants/BasicNft.json";
import networkMapping from "../constants/networkMapping.json";
import marketplaceAbi from "../constants/NftMarketplace.json";

function sellnft() {
  const { isWeb3Enabled, chainId } = useMoralis();

  const dispatch = useNotification();

  const chainString = chainId ? parseInt(chainId).toString() : "5";
  const marketplaceAddress = networkMapping[chainString][0];

  const { runContractFunction } = useWeb3Contract();

  const handleListSuccess = async () => {
    dispatch({
      type: "success",
      message: "NFT Listing",
      title: "NFT Listed",
      position: "topR",
    });
  };

  const handleApproveSuccess = async (tx, nftAddress, tokenId, price) => {
    console.log(`Marketplace approved for nft with tokenId of ${tokenId}`);
    console.log("Ok! Now listing nft to marketplace");
    await tx.wait(1);
    const listOptions = {
      abi: marketplaceAbi,
      contractAddress: marketplaceAddress,
      functionName: "listItem",
      params: {
        nftAddress: nftAddress,
        tokenId: tokenId,
        price: price,
      },
    };
    await runContractFunction({
      params: listOptions,
      onSuccess: () => handleListSuccess(),
      onError: (error) => console.log(error),
    });
  };

  const approveAndList = async (data) => {
    console.log("Approving");
    console.log(data);
    const nftAddress = data.data[0].inputResult;

    const tokenId = data.data[1].inputResult;

    const price = (data.data[2].inputResult * 1e18).toString();

    const approveOptions = {
      abi: nftabi,
      contractAddress: nftAddress,
      functionName: "approve",
      params: {
        to: marketplaceAddress,
        tokenId: tokenId,
      },
    };
    await runContractFunction({
      params: approveOptions,
      onSuccess: (tx) => handleApproveSuccess(tx, nftAddress, tokenId, price),
      onError: (error) => console.log(error),
    });
  };
  return (
    <div className={styles.container}>
      {isWeb3Enabled ? (
        <Form
          onSubmit={approveAndList}
          data={[
            {
              name: "NFT Address",
              type: "text",
              inputWidth: "50%",
              value: "",
              key: "nftAddress",
            },
            { name: "Token Id", type: "number", value: "", key: "tokenId" },
            { name: "Price in ETH", type: "number", value: "", key: "price" },
          ]}
          title="Sell your NFT"
          id="Main Form"
        />
      ) : (
        <div> Please Connect Your Wallet</div>
      )}
    </div>
  );
}

export default sellnft;
