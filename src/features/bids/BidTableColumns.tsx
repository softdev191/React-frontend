import React, { HTMLAttributes, useState } from 'react';
import { format } from 'date-fns-tz';
import { DataTableCell, DataTableCellProps } from '@rmwc/data-table';

import Defaults from '../../constants/Defaults';
import { Text, Image } from '../../components';
import { BidCostDto } from '../../types/Bid';
// import { ActionButton } from './BidList';
import styled from '../../styled-components';
import { API_URL, getAccessToken } from '../../lib/api/Api';
import { formatPrice } from '../../lib/formatPrice';
import { Pricing } from '../../constants/Bid';
import { edit, download, email, dash } from '../../assets/images';
import { Link } from 'react-router-dom';
// import { Dialog, DialogTitle, DialogContent, DialogActions, DialogButton } from '@rmwc/dialog';

type StyleProps = { [key: string]: number | string };
type ColumnRenderProps<RowDataType> = {
  key: string;
  title: string;
  sortable?: boolean;
  hasPopUp: boolean;
  style?: StyleProps;
  headerStyle?: StyleProps;
  hasAction?: boolean;
  renderCell: (row: RowDataType, key: string, style?: StyleProps | undefined, disabled?: boolean) => JSX.Element;
};
export type BidEstimateRowData = {
  division: string;
  description: string;
  cost: string;
};
export type BidCostRowData = {
  id: Pricing;
  costRange: string;
  projectCost: string;
  winningRate: string;
};
export type BidScheduleRowData = {
  id: Pricing;
  schedule: number;
  winningRate: string;
};

const DivisionCostCell = styled(DataTableCell)<HTMLAttributes<DataTableCellProps>>`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

/** Default render as text. */
function renderCell<RowDataType>(row: RowDataType, key: string, style?: StyleProps) {
  return (
    <DataTableCell key={key} style={style}>
      <Text style={{ wordWrap: 'break-word', width: '150px', whiteSpace: 'normal' }} variant='tableBody'>{`${(row as Record<string, any>)[
        key
      ] || ''}`}</Text>
    </DataTableCell>
  );
}

function renderCellPricing<RowDataType>(row: RowDataType, key: string, style?: StyleProps) {
  return (
    <DataTableCell key={key} style={style}>
      <Text
        style={{ wordWrap: 'break-word', textAlign: 'center', width: '120px', whiteSpace: 'normal' }}
        variant='tableBody'
      >{`${(row as Record<string, any>)[key] || ''}`}</Text>
    </DataTableCell>
  );
}

function renderCellWithOutBreakWord<RowDataType>(row: RowDataType, key: string, style?: StyleProps) {
  return (
    <DataTableCell key={key} style={style}>
      <Text variant='tableBody'>{`${(row as Record<string, any>)[key] || ''}`}</Text>
    </DataTableCell>
  );
}

function renderCellWithOutBreakWordPlusIcon<RowDataType>(row: RowDataType, key: string, style?: StyleProps) {
  return (
    <DataTableCell key={key} style={style}>
      <Text variant='tableBody'>{`${(row as Record<string, any>)[key].substring(0, 50) || ''}`}</Text>
    </DataTableCell>
  );
}

function RenderLocationCell(bid: BidCostDto, key: string, style?: StyleProps) {
  const location = bid.city && bid.state ? `${bid.city}, ${bid.state}` : '';

  return (
    <DataTableCell key={key} style={style}>
      <Text style={{ wordWrap: 'break-word', width: '150px', whiteSpace: 'normal', textAlign: 'center' }} variant='tableBody'>
        {location}
      </Text>
    </DataTableCell>
  );
}

function RenderCreatedCell(bid: BidCostDto, key: string, style?: StyleProps) {
  const dateCreated = format(new Date(bid.created), 'MM/dd/yy HH:mm a zzz', { timeZone: Defaults.TIMEZONE });

  return (
    <DataTableCell key={key} style={style}>
      <Text style={{ wordWrap: 'break-word', margin: 'auto', width: '200px', whiteSpace: 'normal' }} variant='tableBody'>
        {dateCreated}
      </Text>
    </DataTableCell>
  );
}

function RenderCostCell(bid: BidCostDto, key: string, style?: StyleProps) {
  const cost = bid.cost ? `$ ${formatPrice(+bid.cost)}` : '';

  return (
    <DataTableCell key={key} style={style}>
      <Text mr={4} variant='tableBody'>
        {cost}
      </Text>
    </DataTableCell>
  );
}

function RenderExportCell(bid: BidCostDto, key: string, style?: StyleProps, disabled?: boolean) {
  const handleDownload = async () => {
    let url = `${API_URL}bids/${bid.id}/export-estimate?token=${getAccessToken()}`;
    window.open(url);
  };

  return (
    <DataTableCell key={key} style={style}>
      {/* <ActionButton variant='primary' onClick={handleDownload} disabled={!bid.cost || disabled}>
        Download Bid
      </ActionButton> */}
      {bid.cost ? (
        <>
          {/* <Image src={download} height={20} mr={3} onClick={handleDownload} className='cursor-pointer' />
          <Image src={email} height={20} mr={3} className='cursor-pointer' /> */}
        </>
      ) : (
        <div>
          <Image src={dash} height={20} mr={3} />
        </div>
      )}
    </DataTableCell>
  );
}

const useTogglePdf = () => {
  const [pdfModal, setPdfModal] = useState(false);
  return pdfModal;
};

const RenderDownloadPlansCell = (bid: BidCostDto, key: string, style?: StyleProps, disabled?: boolean) => {
  function handleDownloadPlans() {
    let url = `${API_URL}bids/${bid.id}/download-plans?token=${getAccessToken()}`;
    window.open(url);
  }

  return (
    <DataTableCell key={key} style={style}>
      {/* <ActionButton variant='primary' mr={3} onClick={handleDownloadPlans} disabled={+bid.plansCount === 0 || disabled}>
        Download Plans
      </ActionButton> */}
      {+bid.plansCount !== 0 ? (
        <>
          <Image src={download} height={20} mr={3} className='cursor-pointer' />
          <Image src={email} height={20} mr={3} className='cursor-pointer' />
        </>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Image src={dash} height={20} mr={3} />
        </div>
      )}
    </DataTableCell>
  );
};

function RenderActionsCell(bid: BidCostDto, key: string, style?: StyleProps, disabled?: boolean) {
  return (
    <DataTableCell key={key} style={style}>
      <Link to={`/bids/${bid.id}/overview`}>
        <Image src={edit} height={20} mr={3} />
      </Link>
      {/* <Image src={deleteIcon} height={20} mr={4} /> */}
      {/* <ActionButton
        variant='outline'
        redirectPath={`/bids/${bid.id}/overview`}
        disabled={disabled}
        {...(disabled && { rippleColor: 'unset' })}
      >
        Edit
      </ActionButton> */}
    </DataTableCell>
  );
}

function renderDivisionCostCell<RowDataType>(row: RowDataType, key: string, style?: StyleProps) {
  return (
    <DivisionCostCell key={key} style={style}>
      <Text variant='tableBody' mr={2}>
        $
      </Text>
      <Text variant='tableBody'>{`${parseFloat((row as Record<string, any>)[key].replace(',', '')).toLocaleString() || ''}`}</Text>
    </DivisionCostCell>
  );
}

/**
 *  Use to customize the render depending on what data is on the cell
 */

export const BidListColumns: ColumnRenderProps<BidCostDto>[] = [
  {
    key: 'actions',
    title: 'Actions',
    headerStyle: { width: 1 },
    hasAction: true,
    hasPopUp: true,
    renderCell: RenderActionsCell
  },
  {
    key: 'name',
    title: 'Project',
    sortable: true,
    hasPopUp: false,
    style: { whiteSpace: 'normal' },
    renderCell
  },
  {
    key: 'location',
    title: 'Location',
    sortable: true,
    hasPopUp: false,
    style: { whiteSpace: 'normal' },
    renderCell: RenderLocationCell
  },
  {
    key: 'cost',
    title: 'Cost',
    sortable: true,
    hasPopUp: false,
    renderCell: RenderCostCell
  },
  {
    key: 'export',
    title: 'BIDs',
    headerStyle: { paddingRight: '35px' },
    hasAction: true,
    hasPopUp: true,
    renderCell: RenderExportCell
  },
  {
    key: 'downloadPlans',
    title: 'Plans',
    headerStyle: { width: 1, paddingRight: '35px' },
    hasAction: true,
    hasPopUp: true,
    renderCell: RenderDownloadPlansCell
  },
  {
    key: 'created',
    title: 'Created',
    sortable: true,
    hasPopUp: false,
    renderCell: RenderCreatedCell
  }
];

export const BidEstimatesColumns: ColumnRenderProps<BidEstimateRowData>[] = [
  {
    key: 'division',
    title: 'Div',
    hasPopUp: false,
    renderCell: renderCellWithOutBreakWord
  },
  {
    key: 'description',
    title: 'Description',
    hasPopUp: false,
    renderCell: renderCellWithOutBreakWordPlusIcon
  },
  {
    key: 'cost',
    title: 'Cost',
    hasPopUp: false,
    headerStyle: { width: 1 },
    renderCell: renderDivisionCostCell
  }
];

export const BidCostColumns: ColumnRenderProps<BidCostRowData>[] = [
  {
    key: 'costRange',
    title: 'Cost Range',
    hasPopUp: false,
    renderCell: renderCellPricing
  },
  {
    key: 'projectCost',
    title: 'Project Cost',
    hasPopUp: false,
    renderCell: renderCellPricing
  },
  {
    key: 'winningRate',
    title: 'Winning Rate',
    hasPopUp: false,
    style: {
      textAlign: 'center'
    },
    renderCell: renderCellPricing
  }
];

export const BidScheduleColumns: ColumnRenderProps<BidScheduleRowData>[] = [
  {
    key: 'schedule',
    title: 'Days',
    hasPopUp: false,
    style: {
      textAlign: 'center'
    },
    renderCell
  },
  {
    key: 'winningRate',
    title: 'Winning Rate',
    hasPopUp: false,
    style: {
      textAlign: 'center'
    },
    renderCell
  }
];
