import * as R from 'ramda';
import {isNilOrEmpty, UNKNOWN} from '../../utils';

const getScaled = key => R.view(R.lensPath([key, 'scaledInLevel']));
const adjustForServer = key => key.match(/\s+-(.*)$/)[1];

const toItem = entries => (acc, key) => {
  const val = entries[key] === UNKNOWN ? UNKNOWN : getScaled(key)(entries);
  return R.assoc(adjustForServer(key), val, acc);
};

const notScaledValue = e => isNilOrEmpty(R.prop('scaledInLevel', e));
const notUnknownValue = e => R.not(R.equals(UNKNOWN));
const noValue = e => R.and(notScaledValue(e), notUnknownValue(e));

const entriesToItems = entries =>
  R.pipe(
    R.reject(noValue),
    R.keys,
    R.reduce(toItem(entries), {}),
  )(entries);

const categoryCommentsToComments = R.reject(isNilOrEmpty);

export const buildFeedback = (subject, state) => ({
  subject,
  items: entriesToItems(state.entries),
  comments: categoryCommentsToComments(state.categoryComments),
});
