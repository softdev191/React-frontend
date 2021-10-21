import { PropsWithChildren } from 'react';

import { DataTable, DataTableContent, DataTableProps } from '@rmwc/data-table';

import styled from '../styled-components';

export const FullWidthDataTable = styled(DataTable)<PropsWithChildren<DataTableProps>>`
  &&& {
    display: flex;
  }
`;

export const FullWidthDataTableContent = styled(DataTableContent)`
  flex: 1;
`;
