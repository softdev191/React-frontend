import React, { useState } from 'react';
import { PlansUploaded } from '../../constants/Bid';

export type BidContextType = { hasPlans?: PlansUploaded; hasEstimate?: boolean; hasUploadedPlans?: boolean } | null | undefined;
export type BidSetStateActionDispatch = React.Dispatch<React.SetStateAction<BidContextType>>;
type BidContextState = {
  bid: BidContextType;
  setBid: BidSetStateActionDispatch;
};
const BidContext = React.createContext<BidContextState>({
  bid: undefined,
  setBid: () => {}
});

type BidProviderProps = {
  children: JSX.Element;
};

function BidProvider(props: BidProviderProps) {
  const { children } = props;
  const [bid, setBid] = useState<BidContextType>(undefined);

  return (
    <BidContext.Provider
      value={{
        bid,
        setBid
      }}
    >
      {children}
    </BidContext.Provider>
  );
}

export { BidContext };
export default BidProvider;
