import React, {useState, useContext} from 'react';
import styled from 'styled-components/macro';
import {FormContext} from './FormContext';
import {EntryNameWrapper} from './Entry/EntryName';
import {entryBorder} from './styles';

const CommentContainer = styled.div`
  display: grid;
  grid-template-columns: 400px 500px 50px 50px;
`;
const CommentLabel = styled(EntryNameWrapper)`
  cursor: pointer;
  align-items: flex-start;
`;
const CommentWrapper = styled.div`
  ${entryBorder};
  padding: 2px 0;
  display: flex;
`;
const TextArea = styled.textarea`
  width: 100%;
  height: 6em;
  padding: 8px;
  margin: 4px 0;
  border: 1px solid #ddd;
`;

const Area = ({open, initValue, onChange}) => {
  const [value, setValue] = useState(initValue);
  return (
    <CommentWrapper>
      {open && (
        <TextArea
          value={value}
          onChange={ev => setValue(ev.target.value)}
          onBlur={ev => onChange(ev.target.value)}
        />
      )}
    </CommentWrapper>
  );
};

export const Comment = ({category}) => {
  const {getCategoryComment, updateCategoryComment} = useContext(FormContext);
  const value = getCategoryComment(category);
  const [open, toggle] = useState(!!value);

  return (
    <CommentContainer>
      <CommentLabel onClick={() => toggle(!open)}>
        Additional Comments (optional)
      </CommentLabel>
      <Area
        open={open}
        initValue={value}
        onChange={comment => updateCategoryComment(category, comment)}
      />
      <div />
    </CommentContainer>
  );
};
