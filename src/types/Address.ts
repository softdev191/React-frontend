import { State } from './State';

export type Address = {
  id: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: State;
  zip: string;
};
