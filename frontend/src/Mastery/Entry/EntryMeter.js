import React, {forwardRef, useImperativeMethods, useRef} from 'react';
import styled from 'styled-components/macro';
import {darken} from 'polished';

const Meter = styled.div`
  border-right: 4px solid ${darken(0.01, '#49c5b1')};
  ${({w}) => `width: ${w}px`};
  ${({w}) => w === 0 && `border-right: 0;`};
  background: ${({theme}) => theme.colors.cjGreen};
  height: 100%;
  align-items: center;
  padding: 0;
`;

function EntryMeter(props, ref) {
  const {pos, disabled} = props;
  const meterRef = useRef(null);
  useImperativeMethods(ref, () => ({
    getBoundingClientRect: () => meterRef.current.getBoundingClientRect(),
    clientWidth: meterRef.current.clientWidth,
  }));
  return (
    <div style={{height: '100%'}} ref={meterRef}>
      <Meter w={disabled ? 0 : pos} />
    </div>
  );
}
// eslint-disable-next-line no-func-assign
EntryMeter = forwardRef(EntryMeter);

export {EntryMeter};
