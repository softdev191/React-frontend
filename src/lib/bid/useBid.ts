import { useContext } from 'react';

import { BidContext, BidContextType, BidSetStateActionDispatch } from './bid.context';

function useBid(bid?: BidContextType): [BidContextType, BidSetStateActionDispatch] {
  const bidContext = useContext(BidContext);
  if (bid) {
    bidContext.setBid(bid);
  }
  return [bidContext.bid, bidContext.setBid];
}

export default useBid;
