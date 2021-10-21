import React, { CSSProperties } from 'react';
import Select from 'react-select';

import theme from '../constants/Theme';

const selectStyles = {
  valueContainer: (styles: CSSProperties) => ({
    ...styles,
    width: '200px',
    height: '55px'
  }),
  control: (styles: CSSProperties, state: any) => ({
    ...styles,
    '&:hover': {
      borderColor: state.isFocused ? styles.borderColor : theme.black
    }
  })
};

function SelectField(props: any) {
  const { defaultValue, name, options, onChange, placeholder, changeOptionLabel, changeOptionValue } = props;

  return (
    <Select
      isMulti
      defaultValue={defaultValue}
      name={name}
      options={options}
      onChange={onChange}
      styles={selectStyles}
      isSearchable={false}
      placeholder={placeholder}
      theme={themes => ({
        ...themes,
        colors: {
          ...themes.colors,
          primary: theme.primary,
          danger: theme.destructiveColor
        }
      })}
      getOptionLabel={option => option[changeOptionLabel]}
      getOptionValue={option => option[changeOptionValue]}
    />
  );
}

export default SelectField;
