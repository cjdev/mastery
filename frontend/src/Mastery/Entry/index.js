import React, {useContext, useRef, useState, useEffect} from 'react';
import {useOutsideClick} from 'react-use';
import {is} from 'ramda';
import styled from 'styled-components/macro';
import {FormContext} from '../FormContext';
import {getRelativeToExpected, levels, levelCats} from '../EntryLevelMap';
import {stripHyphen} from '../../utils';
import {EntryMeter} from './EntryMeter';
import {EntryName} from './EntryName';
import {EntryPosition} from './EntryPosition';
import {EntryFinal} from './EntryFinal';
import {EntryBar} from './EntryBar';
import {NAToggler} from './NAToggler';
import {UNKNOWN} from '../../utils';

const LEVEL_PIXELS = 125;
const MIN_PIXEL_BUFFER = 5;

const positionToLevel = position => {
  if (position === 0) return '';
  // each level is 125
  // break each level into 3
  const factor = LEVEL_PIXELS / 3;
  const idx = Math.floor((position - 1) / factor);
  return levels[idx];
};

const scale = position =>
  Math.round((position / (LEVEL_PIXELS * 4)) * 1000) / 1000;

const scaleInLevel = position => {
  if (position === 0) return '';
  const l = Math.floor(position / LEVEL_PIXELS);
  const scale = Math.round(((position % LEVEL_PIXELS) / LEVEL_PIXELS) * 100);
  return `${levelCats[l]}-${scale}`;
};

const toFeedbackKey = entry => ` ${stripHyphen(entry)}`;

const getUpdateData = (position, isNA) => {
  // console.log('getUpdateData(position, isNA): ', position, isNA);
  return isNA
    ? UNKNOWN
    : {
        position,
        scaled: scale(position),
        scaledInLevel: scaleInLevel(position),
        range: positionToLevel(position),
      };
};

const FeedbackValueMap = {
  Exposed: 0,
  Apprentice: LEVEL_PIXELS * 1,
  Practitioner: LEVEL_PIXELS * 2,
  Master: LEVEL_PIXELS * 3,
};

const convertToFeedbackValue = value => {
  // console.log('value: ', value);
  if (value === UNKNOWN) return UNKNOWN;
  if (!value) return 0;
  // eslint-disable-next-line no-unused-vars
  const [_, levelName, levelVal] = value.match(/(\w+)-(\d+)/);
  const scaledVal = LEVEL_PIXELS * (levelVal / 100);
  return FeedbackValueMap[levelName] + scaledVal;
};

const EntrySet = styled.div`
  display: grid;
  grid-template-columns: 400px ${LEVEL_PIXELS * 4}px 50px 50px;
`;

export const Entry = ({entry}) => {
  const meterRef = useRef(null);
  const {
    updateEntry,
    getLevelForEntry,
    getDescriptionForEntry,
    isMgr,
    feedback,
  } = useContext(FormContext);
  const rawFeedbackValue = feedback.items[toFeedbackKey(entry)];
  const feedbackValue = convertToFeedbackValue(rawFeedbackValue);
  const initialNA = feedbackValue === UNKNOWN;
  const [isNA, setNA] = useState(initialNA);
  // isNA &&
  //   console.log({
  //     entry,
  //     rawFeedbackValue,
  //     feedbackValue,
  //     initialNA,
  //     isNA,
  //   });

  const initialPosition = is(Number, feedbackValue) ? feedbackValue : 0;
  const [position, setPosition] = useState(initialPosition);

  // run once, set the initial value in the store
  useEffect(() => {
    if (feedbackValue > 0 || isNA) {
      updateEntry(entry, getUpdateData(feedbackValue, isNA));
    }
  }, []);

  const [isDragging, setDragging] = useState(false);

  const resetPosition = () => {
    setPosition(0);
    updateEntry(entry, getUpdateData(0, isNA));
  };

  const normalizePosition = position => {
    const {clientWidth} = meterRef.current;
    if (position > clientWidth) return clientWidth;
    // console.log('position: ', position);
    return position < MIN_PIXEL_BUFFER ? 0 : position;
  };

  const handleMouseDown = ev => {
    if (isNA) return;
    const rect = meterRef.current.getBoundingClientRect();
    setPosition(normalizePosition(ev.pageX - rect.left));
    setDragging(true);
  };

  const handleMouseMove = ev => {
    if (isNA) return;
    if (!isDragging) return;
    const rect = meterRef.current.getBoundingClientRect();
    setPosition(normalizePosition(ev.pageX - rect.left));
  };

  const handleMouseUp = ev => {
    if (isNA) return;
    if (!isDragging) return;
    setDragging(false);
    updateEntry(entry, getUpdateData(position, isNA));
  };

  const handleNAToggle = ev => {
    ev.stopPropagation();
    const newNAValue = !isNA;
    setPosition(0);
    updateEntry(entry, getUpdateData(0, newNAValue));
    setNA(newNAValue);
  };

  const levelAtPosition = positionToLevel(position);
  const expectedLevel = getLevelForEntry(entry);
  const relativeToExpected = getRelativeToExpected(
    levelAtPosition,
    expectedLevel,
  );

  const entryBarRef = useRef(null);
  useOutsideClick(entryBarRef, () => {
    if (isDragging) {
      handleMouseUp();
    }
  });

  const ManagerEntryControls = ({
    handleNAToggle,
    isNA,
    resetPosition,
    levelAtPosition,
  }) => {
    return (
      <>
        {levelAtPosition ? (
          <EntryPosition onClick={resetPosition}>
            {levelAtPosition}
          </EntryPosition>
        ) : (
          <NAToggler handleNAToggle={handleNAToggle} isNA={isNA} />
        )}
      </>
    );
  };

  return (
    <EntrySet>
      <EntryName
        entry={entry}
        description={getDescriptionForEntry(entry)}
        disabled={isNA}
      />
      <EntryBar
        ref={entryBarRef}
        disabled={isNA}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={e => e.stopPropagation()}>
        <EntryMeter ref={meterRef} pos={position} disabled={isNA} />
      </EntryBar>
      <EntryFinal relative={relativeToExpected} disabled={isNA}>
        {isMgr() ? (
          <ManagerEntryControls
            resetPosition={resetPosition}
            levelAtPosition={levelAtPosition}
            handleNAToggle={handleNAToggle}
            isNA={isNA}
          />
        ) : (
          <NAToggler handleNAToggle={handleNAToggle} isNA={isNA} />
        )}
      </EntryFinal>
      <EntryFinal disabled={isNA}>
        <EntryPosition>{expectedLevel}</EntryPosition>
      </EntryFinal>
    </EntrySet>
  );
};
