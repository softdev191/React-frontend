import styled from '../styled-components';
import {
  border,
  BorderProps,
  color,
  ColorProps,
  layout,
  LayoutProps,
  shadow,
  ShadowProps,
  space,
  SpaceProps,
  system,
  typography,
  TypographyProps,
  variant
} from 'styled-system';
import theme from '../constants/Theme';

export type TextProps = {
  variant?:
    | 'title'
    | 'subtitle'
    | 'sectionTitle'
    | 'sectionSubtitle'
    | 'screenTitle'
    | 'thumbnailHeading'
    | 'error'
    | 'cardTitle'
    | 'cardSubtitle'
    | 'label'
    | 'banner'
    | 'appNavBar'
    | 'tableBody'
    | 'videotext';
  cursor?: string;
  textTransform?: string;
  whiteSpace?: string;
} & SpaceProps &
  ColorProps &
  LayoutProps &
  BorderProps &
  ShadowProps &
  TypographyProps;

const Text = styled.p<TextProps>(
  {
    margin: 0,
    fontSize: 18,
    fontWeight: 300,
    fontFamily: '"Nunito Sans", Helvetica, Roboto, Arial',
    color: `${theme.black}`
  },
  space,
  color,
  layout,
  shadow,
  typography,
  border,
  system({
    cursor: true,
    textTransform: true,
    whiteSpace: true
  }),
  variant({
    variants: {
      title: {
        fontSize: 40,
        fontWeight: 900,
        textTransform: 'uppercase'
      },
      subtitle: {
        fontSize: 22,
        fontWeight: 800
      },
      sectionTitle: {
        fontSize: 48,
        fontWeight: 800,
        fontFamily: 'Chathura, Roboto',
        textTransform: 'uppercase'
      },
      sectionSubtitle: {
        fontWeight: 700,
        textTransform: 'capitalize'
      },
      screenTitle: {
        fontSize: 40,
        fontWeight: 900,
        letterSpacing: '1.2px',
        color: 'primary'
      },
      thumbnailHeading: {
        fontSize: 36,
        fontWeight: 800,
        fontFamily: 'Chathura, Roboto',
        color: 'primary',
        my: 18
      },
      error: {
        fontSize: 14,
        color: 'red'
      },
      cardTitle: {
        fontSize: 30,
        color: 'primary',
        fontWeight: 900,
        textTransform: 'uppercase'
      },
      cardSubtitle: {
        fontSize: 18,
        color: 'primary'
      },
      label: {
        fontSize: 24,
        fontWeight: 800,
        textTransform: 'uppercase',
        fontFamily: 'Chathura',
        letterSpacing: '0.1em'
      },
      banner: {
        fontWeight: 400,
        letterSpacing: 'medium',
        color: 'white'
      },
      appNavBar: {
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'capitalize'
      },
      tableBody: {
        fontSize: 14
      },
      videotext: {
        fontSize: '65px',
        fontWeight: 'bold'
      }
    }
  })
);

export default Text;
