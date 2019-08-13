import styled from 'styled-components/macro';

export const Group = styled.div`
  margin-bottom: 2em;
`;

export const GroupName = styled.div`
  background: #000;
  color: ${({theme}) => theme.colors.inverseText};
  padding: 8px;
  font-variant: all-small-caps;
  font-size: 1.2em;
  margin-bottom: 16px;
  user-select: none;
`;
