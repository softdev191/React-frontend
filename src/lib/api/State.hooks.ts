import { State } from '../../types/State';
import { useApiGet } from './Api.hooks';

export function useGetStates() {
  return useApiGet<State[] | null>(null, 'states');
}
