import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { Form, useNotification, Button } from "web3uikit";
import { useMoralis, useWeb3Contract } from "react-moralis";
import nftabi from "../constants/BasicNft.json";
import networkMapping from "../constants/networkMapping.json";
import marketplaceAbi from "../constants/NftMarketplace.json";

function sellnft() {
  const { isWeb3Enabled, chainId, account } = useMoralis();

  const [holdings, setHoldings] = useState("0");

  const dispatch = useNotification();

  const chainString = chainId ? parseInt(chainId).toString() : "5";
  const marketplaceAddress = networkMapping[chainString][0];

  const { runContractFunction } = useWeb3Contract();

  const handleListSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Please Refresh",
      title: "NFT Listed",
      position: "topL",
    });
  };

  const handleApproveSuccess = async (tx, nftAddress, tokenId, price) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "MarketPlace Approved",
      position: "topL",
    });
    console.log(`Marketplace approved for nft with tokenId of ${tokenId}`);
    console.log("Ok! Now listing nft to marketplace");

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
      onSuccess: handleListSuccess,
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
  async function setupUI() {
    const returnedHoldings = await runContractFunction({
      params: {
        abi: marketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "getHolding",
        params: {
          seller: account,
        },
      },
    });
    if (returnedHoldings) {
      setHoldings(returnedHoldings.toString());
    }
  }
  const handleWithdrawSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Withdrawing proceeds",
      position: "topR",
    });
  };
  useEffect(() => {
    console.log("Here");
    console.log(isWeb3Enabled);
    if (isWeb3Enabled) {
      console.log("Web3 is Enabled now");
      setupUI();
    }
  }, [isWeb3Enabled, account]);
  // UseEffect will always be triggered on first load and then whenever any of the dependency array item value changes

  return (
    <div className={styles.container}>
      {isWeb3Enabled ? (
        <>
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
          <div>Your Total Holdings are : {holdings / 1e18} ETH </div>
          {holdings != "0" ? (
            <Button
              onClick={() => {
                runContractFunction({
                  params: {
                    abi: marketplaceAbi,
                    contractAddress: marketplaceAddress,
                    functionName: "withdrawHoldings",
                    params: {},
                  },
                  onError: (error) => console.log(error),
                  onSuccess: (tx) => handleWithdrawSuccess(tx),
                });
              }}
              text="Withdraw Holdings"
              type="button"
            />
          ) : (
            <div> Your don't have any Holdings </div>
          )}
        </>
      ) : (
        <div> Please Connect Your Wallet</div>
      )}
    </div>
  );
}

export default sellnft;
