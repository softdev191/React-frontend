import { useCallback } from 'react';

import Defaults from '../../constants/Defaults';
import {
  AcHvacUnits,
  BidPricingSelection,
  BuildingType,
  BusinessType,
  FinishesType,
  FloorLevel,
  PlansUploaded,
  ProfitMargin,
  ProjectType,
  Region,
  ConstructionType,
  StoreInfoType,
  Workscope
} from '../../constants/Bid';
import { BidCostDto, BidDetailsDto, BidDto, BidEstimateDto, BidPricingDto } from '../../types/Bid';
import { HttpMethod } from './Api';
import { useApiGet, useApiMutation } from './Api.hooks';
import { Plan } from '../../types';

type AddressUpsertDto = {
  id?: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateId: number;
  zip: string;
};
type BidUpsertDto = {
  name: string;
  address: AddressUpsertDto;
  projectType: ProjectType;
  businessType: BusinessType | null;
  region: Region | null;
  plansUploaded: PlansUploaded;
};

type BidDetailsUpsertDto = {
  squareFoot: number;
  profitMargin: ProfitMargin;
  workscope: Workscope | null;
  constructionType: ConstructionType | null;
  buildingType: BuildingType | null;
  floor: FloorLevel | null;
  storefront: StoreInfoType | null;
  acHvacUnits: AcHvacUnits | null;
  finishes: FinishesType;
};

type BidPlanResponseDto = {
  plans: Plan[];
  amepPlan: number;
  mPlan: number;
  ePlan: number;
  pPlan: number;
};
type BidPlanDeleteDto = {
  planId: number;
};
type BidPlanUpdateDto = {
  plansUploaded: number;
  amepPlan: number;
  mPlan: number;
  ePlan: number;
  pPlan: number;
};

type BidPricingCostDto = {
  pricing: {
    lowCost: number;
    goodCost: number;
    highCost: number;
    lowSchedule: number;
    highSchedule: number;
  };
  mediumCost: number;
  mediumSchedule: number;
  selected: BidPricingSelection;
};
type BidPricingUpdateDto = { selected: BidPricingSelection };

export function useGetBidsByPage() {
  const { get: originalGet, ...rest } = useApiGet<BidCostDto[]>([], 'bids/');

  const get = useCallback(
    async (params: { page?: number; query?: string; sort?: string; limit?: number }) => {
      const defaults = {
        page: 0,
        limit: Defaults.LIST_PAGE_SIZE
      };
      await originalGet({ ...defaults, ...params });
    },
    [originalGet]
  );

  return { ...rest, get };
}

export function useGetBidsCount() {
  return useApiGet<number | null>(null, 'bids/count');
}

export function useGetBidById(id: number) {
  return useApiGet<BidDto | null>(null, `bids/${id}`);
}

export function useUpsertBid(id?: number) {
  const { mutate, ...rest } = useApiMutation<BidDto, BidUpsertDto>(
    null,
    id ? HttpMethod.PATCH : HttpMethod.POST,
    id ? `bids/${id}` : 'bids'
  );

  const upsert = useCallback(
    async (bid: BidUpsertDto) => {
      await mutate(bid);
    },
    [mutate]
  );

  return { ...rest, upsert };
}

export function useGetBidDetails(bidId: number) {
  return useApiGet<BidDetailsDto | null>(null, `bids/${bidId}/details`);
}

export function useDeleteBid(bidId: number) {
  return useApiMutation<any, null>(null, HttpMethod.DELETE, `bids/${bidId}`);
}

export function useUpsertBidDetails(bidId: number) {
  const { data, response, mutate, ...rest } = useApiMutation<BidDetailsDto, BidDetailsUpsertDto>(
    null,
    HttpMethod.POST,
    `bids/${bidId}/details`
  );

  const upsert = useCallback(
    async (bidDetails: BidDetailsUpsertDto) => {
      await mutate(bidDetails);
    },
    [mutate]
  );

  return { ...rest, data, upsert };
}

export function useGetBidEstimates(bidId: number) {
  // const RANGE = JSON.parse(localStorage.getItem('RANGE') || '{}');
  return useApiGet<BidEstimateDto | null>(null, `bids/${bidId}/estimate`);
}

export function useGetBidEstimates1(bidId: number, range: string) {
  return useApiGet<BidEstimateDto | null>(null, `bids/${bidId}/estimate?type=${range}`);
}

export function useCalculateEstimates(bidId: number) {
  return useApiMutation<BidEstimateDto, null>(null, HttpMethod.POST, `bids/${bidId}/estimate`);
}

export function useGetBidPlans(bidId: number) {
  return useApiGet<BidPlanResponseDto | null>(null, `bids/${bidId}/plans`);
}

export function useDeleteBidPlan(bidId: number) {
  const { mutate, ...rest } = useApiMutation<Plan, BidPlanDeleteDto>(null, HttpMethod.PATCH, `bids/${bidId}/delete-plan`);

  const bidPlanDelete = useCallback(
    async (plan: BidPlanDeleteDto) => {
      await mutate(plan);
    },
    [mutate]
  );

  return { ...rest, bidPlanDelete };
}

export function useUpdatePlans(id?: number) {
  const { mutate, ...rest } = useApiMutation<BidDto, BidPlanUpdateDto>(null, HttpMethod.PATCH, `bids/${id}/plans`);

  const upsert = useCallback(
    async (plans: BidPlanUpdateDto) => {
      await mutate(plans);
    },
    [mutate]
  );

  return { ...rest, upsert };
}

export function useGetBidPricing(bidId: number) {
  return useApiGet<BidPricingCostDto | null>(null, `bids/${bidId}/pricing`);
}

export function useUpdateBidPricing(bidId: number) {
  const { mutate, ...rest } = useApiMutation<BidPricingDto, BidPricingUpdateDto>(null, HttpMethod.PATCH, `bids/${bidId}/update-pricing`);

  const update = useCallback(
    async (pricing: BidPricingUpdateDto) => {
      await mutate(pricing);
    },
    [mutate]
  );

  return { ...rest, update };
}
