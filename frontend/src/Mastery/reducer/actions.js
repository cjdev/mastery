import {createAction} from 'redux-actions';
import {buildFeedback} from './buildFeedback';
import {saveFeedback as apiSaveFeedback} from '../../api';

export const saveFeedbackAction = subject => async (dispatch, getState) => {
  dispatch(saveFeedbackStart());
  try {
    const feedback = buildFeedback(subject, getState());
    const result = await apiSaveFeedback(feedback);
    dispatch(saveFeedbackSuccess(result));
  } catch (err) {
    dispatch(saveFeedbackError(err));
  }
};

const SET_CATEGORY_COMMENTS = '@mastery/SET_CATEGORY_COMMENTS';
const SET_TEMPLATE = '@mastery/SET_TEMPLATE';
const SET_ENTRIES = '@mastery/SET_ENTRIES';
const UPDATE_ENTRY = '@mastery/UPDATE_ENTRY';
const UPDATE_LEVEL = '@mastery/UPDATE_LEVEL';
const SET_INITIAL_FEEDBACK = '@mastery/SET_INITIAL_FEEDBACK';
const UPDATE_CATEGORY_COMMENT = '@mastery/UPDATE_CATEGORY_COMMENT';

export const NOOP = createAction('@mastery/NOOP');
export const setAssignments = createAction('@mastery/SET_ASSIGNMENTS');
export const setCategoryComments = createAction(SET_CATEGORY_COMMENTS);
export const setTemplate = createAction(SET_TEMPLATE);
export const setEntries = createAction(SET_ENTRIES);
export const updateEntry = createAction(UPDATE_ENTRY);
export const updateLevel = createAction(UPDATE_LEVEL);
export const setInitialFeedback = createAction(SET_INITIAL_FEEDBACK);
export const updateCategoryComment = createAction(UPDATE_CATEGORY_COMMENT);
export const saveFeedback = saveFeedbackAction;
export const saveFeedbackStart = createAction('@mastery/SAVE_FEEDBACK_START');
export const saveFeedbackSuccess = createAction(
  '@mastery/SAVE_FEEDBACK_SUCCESS',
);
export const saveFeedbackError = createAction('@mastery/SAVE_FEEDBACK_ERROR');
