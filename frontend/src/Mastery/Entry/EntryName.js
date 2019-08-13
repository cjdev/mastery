import React from 'react';
import {useToggle} from 'react-use';
import styled from 'styled-components/macro';
import {stripHyphen} from '../../utils';
import {disabled, entryBorder} from '../styles';

export const EntryNameWrapper = styled.div`
  ${entryBorder};
  ${disabled};
`;

const Description = styled.div`
  margin-top: 4px;
  line-height: 1.4em;
  font-size: 0.8em;
  font-style: italic;
`;

const Name = styled.div`
  display: flex;
  justify-content: flex-end;
  text-align: right;
  user-select: none;
  font-variant: all-small-caps;
  ${({d}) =>
    d &&
    `
    cursor: pointer;
    &:after {
      content: '...';
  }
  `};
`;

export const EntryName = ({entry, description, disabled}) => {
  const [openDesc, toggleDesc] = useToggle(false);
  return (
    <EntryNameWrapper disabled={disabled}>
      <Name d={description} onClick={() => description && toggleDesc()}>
        {stripHyphen(entry)}
      </Name>
      {openDesc && (
        <Description onClick={() => toggleDesc()}>{description}</Description>
      )}
    </EntryNameWrapper>
  );
};
