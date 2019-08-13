import styled from 'styled-components/macro';
import {entryBorder, disabled} from '../styles';

export const EntryBar = styled.div`
  background: #f9f9f9;
  cursor: col-resize;
  ${disabled};

  // padding 0 clobbers the padding in entryBorder
  ${entryBorder};
  padding: 0;
`;
