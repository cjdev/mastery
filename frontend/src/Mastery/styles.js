import {css} from 'styled-components/macro';

export const entryBorder = css`
  border-bottom: 1px solid #eee;
  padding: 8px 8px;
`;

export const disabled = css`
  ${({theme, disabled}) =>
    disabled &&
    `
    cursor: initial;
    background: ${theme.disabled.background};
    color: ${theme.disabled.color};
  `};
`;

export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;
