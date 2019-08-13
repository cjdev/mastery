import * as R from 'ramda';
import {UNKNOWN} from '../../utils';

const countScored = R.pipe(
  R.values,
  R.filter(e => (e.position && e.position > 0) || e === UNKNOWN),
  R.length,
);
const count = e => R.length(R.keys(e));

const calculateProgress = entries =>
  Math.round((countScored(entries) / count(entries)) * 100);

export const handleUpdateEntry = (state, action) => {
  const entries = {
    ...state.entries,
    [action.payload.entry]: action.payload.data,
  };
  return {
    ...state,
    progress: calculateProgress(entries),
    entries,
  };
};

export const handleSetEntries = (state, action) => ({
  ...state,
  progress: 0,
  entries: action.payload,
});

export const handleUpdateLevel = (state, action) => ({
  ...state,
  level: action.payload,
});

export const handleSetInitialFeedback = (state, action) => ({
  ...state,
  categoryComments: {
    ...state.categoryComments,
    ...action.payload.comments,
  },
  feedback: action.payload,
});

export const handleSetTemplate = (state, action) => ({
  ...state,
  template: action.payload,
});

export const handleSetAssignments = (state, action) => ({
  ...state,
  assignments: action.payload,
});

export const handleSetCategoryComments = (state, action) => ({
  ...state,
  categoryComments: action.payload,
});

export const handleUpdateCategoryComment = (state, action) => ({
  ...state,
  categoryComments: {
    ...state.categoryComments,
    [action.payload.category]: action.payload.comment,
  },
});

export const handleSaveFeedbackStart = (state, action) => {
  return {
    ...state,
    save: {
      loading: true,
      error: null,
      result: null,
    },
  };
};

export const handleSaveFeedbackSuccess = (state, action) => {
  return {
    ...state,
    save: {
      loading: false,
      result: action.payload,
    },
  };
};

export const handleSaveFeedbackError = (state, action) => {
  return {
    ...state,
    save: {
      loading: false,
      error: action.payload,
      result: null,
    },
  };
};

export const handleNOOP = (state, action) => state;
