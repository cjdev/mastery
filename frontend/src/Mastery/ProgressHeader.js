import React, {useContext} from 'react';
import styled from 'styled-components/macro';
import {Button} from '@cjdev/visual-stack/lib/components/Button';
import {FormContext} from './FormContext';
import {InlineSpinner} from '../Components/Spinner';

const HeaderWrapper = styled.div`
  color: #333;
  background: rgba(255, 255, 255, 1);
  border-bottom: 1px solid #ccc;
  font-weight: 600;
  font-variant: all-small-caps;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const HeaderMain = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HeaderBar = styled.div`
  ${({progress}) => `width: ${progress}%`};
  height: 4px;
  background: ${({theme}) => theme.colors.cjGreen};
`;

const Left = styled.div`
  display: flex;
  align-items: center;
`;
const Right = Left;
const People = styled.div`
  margin-right: 8px;
  min-height: 28px;
  display: flex;
  align-items: center;
`;

const Levels = styled.div`
  display: flex;
  align-items: center;
  user-select: none;
`;
const Level = styled.div`
  border: 1px solid #ddd;
  color: #333;
  padding: 4px;
  margin: 0 4px;
  border-radius: 3px;
  background: ${({theme, active}) =>
    active ? theme.colors.cjGreen : 'transparent'};
  ${({active}) => active && 'color: #fff'};
  cursor: pointer;
  &:hover {
    background: #48535f;
    color: #fff;
  }
`;
const ButtonWrapper = styled.div`
  margin-left: 8px;
`;

const buildLevel = (level, idx, currentLevel, setLevel) => {
  const active = level === currentLevel;
  return (
    <Level
      key={idx}
      active={active}
      onClick={() => setLevel(active ? null : level)}>
      {level}
    </Level>
  );
};

const PercentComplete = ({progress}) => <div>{progress}% complete</div>;

const RightSide = ({subject}) => {
  const {progress, saveFeedback, saveState} = useContext(FormContext);

  const showLoading = saveState.loading;
  const showError = !showLoading && saveState.error;
  const showProgress = !showLoading && !showError;

  return (
    <Right>
      {showLoading && (
        <>
          <InlineSpinner />
          <div>Saving...</div>
        </>
      )}
      {showError && <>ERROR! {saveState.error.message}</>}
      {showProgress && (
        <>
          <PercentComplete progress={progress} />
        </>
      )}

      <ButtonWrapper>
        <Button
          type={showLoading ? 'text' : 'solid-primary'}
          disabled={showLoading}
          onClick={() => saveFeedback(subject)}>
          Save
        </Button>
      </ButtonWrapper>
    </Right>
  );
};

export const ProgressHeader = ({user, subject}) => {
  const {progress, level, setLevel, isMgr} = useContext(FormContext);
  return (
    <HeaderWrapper>
      <HeaderMain>
        <Left>
          <People>
            {user} {subject && ` / ${subject}`}
          </People>
          {isMgr() && (
            <Levels>
              {['SE3', 'SSE', 'PRI'].map((l, idx) =>
                buildLevel(l, idx, level, setLevel),
              )}
            </Levels>
          )}
        </Left>
        <RightSide subject={subject} />
      </HeaderMain>
      <HeaderBar progress={progress} />
    </HeaderWrapper>
  );
};
