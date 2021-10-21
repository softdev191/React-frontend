import React from 'react';
import {
  TextField as RMWCTextField,
  TextFieldProps as RMWCTextFieldProps,
  TextFieldHTMLProps as RMWCTextFieldHTMLProps
} from '@rmwc/textfield';

import styled, { css } from '../styled-components';

const FullWidthTextField = styled(RMWCTextField)<RMWCTextFieldHTMLProps & TextFieldProps>`
  ${({ error, touched, theme }) => css`
    width: 100%;
    height: 44px;
    &&& {
      * {
        border-color: ${error && touched ? theme.destructiveColor : theme.alto};
      }
    }
  `};
`;

export type TextFieldProps = RMWCTextFieldProps & {
  name?: string;
  className?: string;
  onFocus?: (e: React.FocusEvent<any>) => void;
  onChange?: (e: React.ChangeEvent<any>) => void;
  onBlur?: (e: React.FocusEvent<any>) => void;
  onKeyUp?: (e: React.KeyboardEvent<any>) => void;
  error?: string;
  touched?: boolean;
  maxLength?: number;
};

function TextField(props: TextFieldProps) {
  const { className, ...rest } = props;
  return (
    <div className={className}>
      <FullWidthTextField {...rest} />
    </div>
  );
}

export default TextField;
