import * as R from 'ramda';

export const UNKNOWN = 'unknown';
export const stripHyphen = entry => entry.match(/ - (.*)$/)[1];
export const isNilOrEmpty = e => R.or(R.isNil(e), R.isEmpty(e));
