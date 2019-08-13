import React from 'react';
import styled from 'styled-components/macro';
import {Link} from '@reach/router';
import {getUser} from '../userStorage';
import {Logout} from '../Components/Logout';

export const NavLink = styled(Link)`
  display: block;
  font-variant: all-small-caps;
  font-size: 1.2em;
  color: #333;
  line-height: 1.8em;
  margin: 0 8px;
  padding: 0 8px;
  border-radius: 4px;
  text-decoration: none;
  ${({theme}) => `
  &:hover {
    background: ${theme.link.bg};
  }
  `}
`;

const Nav = styled.nav`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export default () => (
  <Nav>
    <NavLink to="/">Home</NavLink>
    <NavLink to={`/mastery/${getUser()}`}>{getUser()}</NavLink>
    <Logout />
  </Nav>
);
