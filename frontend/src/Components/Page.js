import React from 'react';
import styled from 'styled-components/macro';
import Nav from './Nav';

const Container = styled.div`
  max-width: 1000px;
  margin: 0.3em auto;
  // @media (max-width: 1000px) {
  //   max-width: 90%;
  // }
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const TitleWrapper = styled.div`
  font-variant: all-small-caps;
  font-size: 2em;
  letter-spacing: 4px;
`;
export const Title = () => <TitleWrapper>Mastery</TitleWrapper>;

const PageContent = styled.div``;

export default ({onClick = () => {}, children}) => (
  <div onClick={onClick}>
    <Container>
      <Header>
        <Title />
        <Nav />
      </Header>
      <PageContent>{children}</PageContent>
    </Container>
  </div>
);
