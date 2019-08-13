import React from 'react';
import styled from 'styled-components/macro';
import {CloseIcon} from '../../Components/Icons';
import {flexCenter} from '../styles';

const Toggler = styled.div`
  ${flexCenter};
  cursor: pointer;
  &:hover {
    background: #f0f0f0;
  }
`;

const StyledCloseIcon = styled(CloseIcon)`
  padding: 4px;
  path {
    fill: #666;
  }
  &:hover {
    path {
      fill: #000;
    }
  }
`;

export const NAToggler = ({handleNAToggle, isNA}) => (
  <Toggler onClick={handleNAToggle} value={isNA}>
    <StyledCloseIcon value={isNA} />
  </Toggler>
);
