import React from 'react';

import theme from '../../constants/Theme';
import styled from '../../styled-components';
import { Box, Text } from '../../components';
import {
  AcHvacUnits,
  AcHvacUnitsChoices,
  PlansUploadOptions,
  BuildingType,
  BuildingTypes,
  BusinessType,
  BusinessTypes,
  FinishesTypes,
  FloorLevel,
  FloorLevels,
  PlansUploaded,
  ProfitMargins,
  ProjectTypes,
  Region,
  Regions,
  ConstructionType,
  ConstructionTypes,
  StoreInfoType,
  StoreInfoTypes,
  Workscope,
  WorkscopeNames,
  PlansUploadedKey
} from '../../constants/Bid';
import { BidDetailsDto, BidDto } from '../../types';

const SummaryContainer = styled(Box)`
  max-width: 400px;
  border-radius: 8px;
  background: ${theme.alabaster};
  padding: 40px;
  margin-bottom: 30px;
  min-width: 300px;
  @media (max-width: 768px) {
    padding: 10px;
    margin-top: 30px;
  }
`;

const SummaryBody = styled(Box)`
  display: grid;
  grid-gap: 8px 16px;
  grid-template-columns: auto auto;

  p {
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 0;
    @media (max-width: 768px) {
      font-size: 14px;
    }
  }
`;

const Label = styled(Text)`
  white-space: nowrap;
`;

export const BidOverviewSummary = (props: { bid: BidDto }) => {
  const { bid } = props;
  const { region, businessType } = bid;

  const regionVal = region === null ? Region.DONT_KNOW : region;
  const businessTypeVal = businessType === null ? BusinessType.DONT_KNOW : businessType;

  return (
    <SummaryContainer flex={1}>
      <Text variant='sectionTitle' lineHeight={0.5} mb={40}>
        Overview
      </Text>
      <SummaryBody>
        <Label variant='sectionSubtitle'>Name</Label>
        <Text>{bid.name}</Text>

        <Label variant='sectionSubtitle'>Project Type</Label>
        <Text>{ProjectTypes[bid.projectType!]}</Text>

        <Label variant='sectionSubtitle'>Address</Label>
        <div>
          <Text>{bid.address?.addressLine1}</Text>
          <Text>{bid.address?.addressLine2}</Text>
        </div>

        <Label variant='sectionSubtitle'>Region</Label>
        <Text>{Regions[regionVal]}</Text>

        <Label variant='sectionSubtitle'>Business Type</Label>
        <Text>{BusinessTypes[businessTypeVal]}</Text>
      </SummaryBody>
    </SummaryContainer>
  );
};

export const BidPlansSummary = (props: { bid: BidDto }) => {
  const { bid } = props;

  return (
    <SummaryContainer flex={1}>
      <Text variant='sectionTitle' lineHeight={0.5} mb={40}>
        Plans
      </Text>
      <SummaryBody>
        {bid.plansUploaded === PlansUploaded.UPLOADED ? (
          <>
            <Label variant='sectionSubtitle'>Complete AMEP Sheets</Label>
            <Text>{PlansUploadOptions[bid.amepPlan]}</Text>

            {bid.amepPlan !== PlansUploadedKey.YES && (
              <>
                <Label variant='sectionSubtitle'>Mechanical - "M" </Label>
                <Text>{PlansUploadOptions[bid.mPlan]}</Text>

                <Label variant='sectionSubtitle'>Electrical - "E"</Label>
                <Text>{PlansUploadOptions[bid.ePlan]}</Text>

                <Label variant='sectionSubtitle'>Plumbing - "P"</Label>
                <Text>{PlansUploadOptions[bid.pPlan]}</Text>
              </>
            )}
          </>
        ) : (
          <Text>No Plans</Text>
        )}
      </SummaryBody>
    </SummaryContainer>
  );
};

export const BidDetailsSummary = (props: { details: BidDetailsDto }) => {
  const { details } = props;
  const { workscope, constructionType, buildingType, floor, storefront, acHvacUnits } = details;

  const workscopeVal = workscope === null ? Workscope.DONT_KNOW : workscope;
  const constructionTypeVal = constructionType === null ? ConstructionType.DONT_KNOW : constructionType;
  const buildingTypeVal = buildingType === null ? BuildingType.DONT_KNOW : buildingType;
  const floorVal = floor === null ? FloorLevel.DONT_KNOW : floor;
  const storefrontVal = storefront === null ? StoreInfoType.DONT_KNOW : storefront;
  const acHvacUnitsVal = acHvacUnits === null ? AcHvacUnits.DONT_KNOW : acHvacUnits;

  return (
    <SummaryContainer flex={1}>
      <Text variant='sectionTitle' lineHeight={0.5} mb={40}>
        Details
      </Text>
      <SummaryBody>
        <Label variant='sectionSubtitle'>Work Scope</Label>
        <Text>{WorkscopeNames[workscopeVal]}</Text>

        <Label variant='sectionSubtitle'>Construction Type</Label>
        <Text>{ConstructionTypes[constructionTypeVal]}</Text>

        <Label variant='sectionSubtitle'>Building Type</Label>
        <Text>{BuildingTypes[buildingTypeVal]}</Text>

        <Label variant='sectionSubtitle'>Floor</Label>
        <Text>{FloorLevels[floorVal]}</Text>

        <Label variant='sectionSubtitle'>Store Front</Label>
        <Text>{StoreInfoTypes[storefrontVal]}</Text>

        <Label variant='sectionSubtitle'>AC/HVAC</Label>
        <Text>{AcHvacUnitsChoices[acHvacUnitsVal]}</Text>

        <Label variant='sectionSubtitle'>Sq. Ft.</Label>
        <Text>{details.squareFoot}</Text>

        <Label variant='sectionSubtitle'>Finishes</Label>
        <Text>{FinishesTypes[details.finishes!]?.title}</Text>

        <Label variant='sectionSubtitle'>Profit Margin</Label>
        <Text>{ProfitMargins[details.profitMargin!]}</Text>
      </SummaryBody>
    </SummaryContainer>
  );
};
