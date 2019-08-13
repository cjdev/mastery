import React from 'react';
import styled, {css} from 'styled-components/macro';
import {addIndex, keys, map, pipe} from 'ramda';
import {Entry} from './Entry';
import {Comment} from './Comment';
const mapIndex = addIndex(map);

const CategoryContainer = styled.div`
  margin-bottom: 2em;
`;

const CategoryHeader = styled.div`
  display: grid;
  grid-template-columns: 400px 125px 125px 125px 125px 50px 50px;
  grid-template-areas: '. exposed apprentice practitioner master . .';
  background: #48535f;
  color: ${({theme}) => theme.colors.inverseText};
  position: sticky;
  top: 53px;
`;

const level = css`
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-variant: all-small-caps;
  user-select: none;
`;
const borderRight = css`
  border-right: 1px solid #666;
`;
const Exposed = styled.div`
  ${level};
  ${borderRight};
  grid-area: exposed;
`;
const Apprentice = styled.div`
  ${level};
  ${borderRight};
  grid-area: apprentice;
`;
const Practitioner = styled.div`
  ${level};
  ${borderRight};
  grid-area: practitioner;
`;
const Master = styled.div`
  ${level};
  grid-area: master;
`;
const CategoryName = styled.div`
  padding: 8px;
  font-variant: all-small-caps;
  font-size: 1.2em;
  user-select: none;
`;

const Category = ({category, entries}) => (
  <CategoryContainer>
    <CategoryHeader>
      <CategoryName>{category}</CategoryName>
      <Exposed>Exposed</Exposed>
      <Apprentice>Apprentice</Apprentice>
      <Practitioner>Practitioner</Practitioner>
      <Master>Master</Master>
    </CategoryHeader>
    <div>{mapIndex((e, idx) => <Entry key={idx} entry={e} />)(entries)}</div>
    <Comment category={category} />
  </CategoryContainer>
);

export const Categories = ({categories}) => {
  // console.log('categories: ', categories);
  return (
    <div>
      {pipe(
        keys,
        mapIndex((cat, idx) => (
          <Category key={idx} category={cat} entries={categories[cat]} />
        )),
      )(categories)}
    </div>
  );
};
