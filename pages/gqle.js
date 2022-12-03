import { useQuery, gql } from "@apollo/client";

const GET_ACTIVE_ITEM = gql`
  {
    activeItems(
      first: 5
      where: { buyer: "0x0000000000000000000000000000000000000000" }
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

function gqle() {
  const { loading, error, data } = useQuery(GET_ACTIVE_ITEM);
  return (
    <div>
      <h1>graphQL Indexing</h1>
      {console.log(data)}
    </div>
  );
}

export default gqle;
