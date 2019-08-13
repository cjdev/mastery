import React from 'react';
import Icon from '@mdi/react';
import {mdiClose, mdiLoading} from '@mdi/js';

export const CloseIcon = props => (
  <Icon path={mdiClose} size={'16px'} {...props} />
);
export const LoadingIcon = props => (
  <Icon path={mdiLoading} size={'4em'} spin={1.5} {...props} />
);
