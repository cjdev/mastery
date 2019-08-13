import styled from 'styled-components/macro';
import {entryBorder, flexCenter, disabled} from '../styles';

export const EntryFinal = styled.div`
  ${entryBorder};
  ${flexCenter};
  font-variant: all-small-caps;
  user-select: none;
  ${({theme, relative}) => {
    switch (relative) {
      case 'ABOVE':
        return `
          color: #fff;
          background: ${theme.colors.cjGreen}`;
      case 'BELOW':
        return `
          background: ${theme.colors.below};
        `;
      default:
        return '';
    }
  }};
  ${disabled};
`;
