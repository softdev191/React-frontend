import {
  AcHvacUnits,
  PlansUploadedKey,
  BuildingType,
  BusinessType,
  Division,
  FinishesType,
  FloorLevel,
  PlansUploaded,
  ProfitMargin,
  ProjectType,
  Region,
  ConstructionType,
  StoreInfoType,
  Workscope
} from '../constants/Bid';
import { Address } from './Address';

export type BidDto = {
  id: number;
  name: string;
  address: Address;
  projectType: ProjectType;
  businessType: BusinessType | null;
  region: Region | null;
  plansUploaded: PlansUploaded;
  amepPlan: PlansUploadedKey;
  mPlan: PlansUploadedKey;
  ePlan: PlansUploadedKey;
  pPlan: PlansUploadedKey;
};

export type BidDetailsDto = {
  id: number;
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

export type Inspections = {
  totalInspections: number;
  roughInspections: number;
  finalInspections: number;
  fireDeptInspections: number;
  greaseDuctInspections: number;
  preHealthInspections: number;
  finalHealthInspections: number;
  finalBldgInspections: number;
};
export type DivisionValue = {
  [Division.DIV_1]: number;
  [Division.DIV_2]: number;
  [Division.DIV_3_4]: number;
  [Division.DIV_5_7]: number;
  [Division.DIV_8]: number;
  [Division.DIV_9]: number;
  [Division.DIV_10]: number;
  [Division.DIV_11_12]: number;
  [Division.DIV_13]: number;
  [Division.DIV_15]: number;
  [Division.DIV_15_1]: number;
  [Division.DIV_16]: number;
};
export type BidEstimateDto = {
  divisions: DivisionValue;
  profitMargin: number;
  totalCost: number;
  daysToComplete: number;
  inspections: Inspections;
  costPerSq: number;
};

export type BidPricingDto = {
  lowCost: number;
  goodCost: number;
  highCost: number;
  lowSchedule: number;
  highSchedule: number;
};

export type BidCostDto = {
  id: number;
  name: string;
  city: string;
  state: string;
  cost: number | null;
  created: Date;
  plansCount: number;
};
