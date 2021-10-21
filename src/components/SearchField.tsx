import React from 'react';

import styled from '../styled-components';
import TextField, { TextFieldProps } from './TextField';

const StyledTextField = styled(TextField)`
  margin: 0 10px;
`;

export interface SearchFieldProps extends TextFieldProps {
  className?: string;
  name?: string;
  label?: string;
  searchString?: string;
  onSearch: (searchString: string) => void;
}

function SearchField(props: SearchFieldProps) {
  const { className, searchString, onSearch, name = 'Search', label = 'Search' } = props;
  return (
    <div className={className}>
      <StyledTextField
        outlined
        type='text'
        rootProps={{ autoComplete: false, name }}
        label={label}
        onChange={(event: React.ChangeEvent<any>) => onSearch(event.target.value)}
        value={searchString}
      />
    </div>
  );
}

export default SearchField;
