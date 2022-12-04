import { gql } from "@apollo/client";

const GET_ACTIVE_ITEMS = gql`
  {
    activeItems(
      first: 5
      where: {
        buyer: "0x0000000000000000000000000000000000000000"
        nftAddress: "0xd0d3f00ccedb09373ff1ee3c563840f56c14e688"
      }
    ) {
      id
      buyer
      seller
      nftAddress
      tokenId
      price
    }
  }
`;
export default GET_ACTIVE_ITEMS;
