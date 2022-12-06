import { useState } from "react";
import { Modal, Input, useNotification } from "web3uikit";
import { useWeb3Contract } from "react-moralis";

function UpdateListing({
  isVisible,
  onClose,
  marketplaceAddress,
  marketplaceAbi,
  nftAddress,
  tokenId,
}) {
  const [newPrice, setNewPrice] = useState(0);
  const dispatch = useNotification();

  const handleUpdateListingSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Nft Updated",
      title: "Nft Updated.Please Refresh",
      position: "topR",
    });
    onClose && onClose();
    setNewPrice(0);
  };

  const { runContractFunction: updateNft } = useWeb3Contract({
    abi: marketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "updateItem",
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
      newPrice: (newPrice * 1e18).toString(),
    },
  });
  return (
    <Modal
      isVisible={isVisible}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      onOk={() => {
        updateNft({
          onError: (error) => console.log(error),
          onSuccess: (tx) => handleUpdateListingSuccess(tx),
        });
      }}
    >
      <Input
        label="Update listing price in l1 Currency (ETH)"
        name="New Listing Price"
        type="number"
        onChange={(e) => setNewPrice(e.target.value)}
      />
    </Modal>
  );
}

export default UpdateListing;
