import React, {useContext} from 'react';
import {addIndex, keys, map, pipe} from 'ramda';
import {Group, GroupName} from './Group';
import {Categories} from './Category';
import {FormContext} from './FormContext';

const mapIndex = addIndex(map);

export const FeedbackForm = () => {
  const {template} = useContext(FormContext);
  return (
    <>
      {pipe(
        keys,
        mapIndex((group, idx) => (
          <Group key={idx}>
            <GroupName>{group.match(/=+(.*?)=+/)[1]}</GroupName>
            <Categories categories={template[group]} />
          </Group>
        )),
      )(template)}
    </>
  );
};
