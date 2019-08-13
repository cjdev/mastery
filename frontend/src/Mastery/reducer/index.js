import {handleActions} from 'redux-actions';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';
import useMiddleware from 'react-usemiddleware';
import * as Handlers from './handlers';
import * as Actions from './actions';

const DEBUG_REDUCER = true;
// eslint-disable-next-line no-unused-vars
const debugHandler = handler => {
  return function(state, action) {
    console.log('DEBUG', handler.name, action);
    return handler(state, action);
  };
};
// eslint-disable-next-line no-unused-vars
const d = debugHandler;

// initialization -----------------------------------------------
//
const initialState = {
  assignments: [],
  categoryComments: {},
  entries: {},
  feedback: {},
  level: null,
  outsideClick: false,
  progress: 0,
  template: {},
  save: {
    loading: false,
    error: null,
    result: null,
  },
};

const reducer = handleActions(
  {
    [Actions.setAssignments]: Handlers.handleSetAssignments,
    [Actions.setCategoryComments]: Handlers.handleSetCategoryComments,
    [Actions.setTemplate]: Handlers.handleSetTemplate,
    [Actions.setEntries]: Handlers.handleSetEntries,
    [Actions.updateEntry]: Handlers.handleUpdateEntry,
    [Actions.updateLevel]: Handlers.handleUpdateLevel,
    [Actions.setInitialFeedback]: Handlers.handleSetInitialFeedback,
    [Actions.updateCategoryComment]: Handlers.handleUpdateCategoryComment,
    [Actions.saveFeedbackStart]: Handlers.handleSaveFeedbackStart,
    [Actions.saveFeedbackSuccess]: Handlers.handleSaveFeedbackSuccess,
    [Actions.saveFeedbackError]: Handlers.handleSaveFeedbackError,
    [Actions.NOOP]: Handlers.handleNOOP,
  },
  initialState,
);

export const useMasteryReducer = () => {
  const middlewares = [thunk];
  DEBUG_REDUCER &&
    middlewares.push(
      createLogger({
        level: 'info',
        collapsed: true,
      }),
    );
  return useMiddleware(reducer, initialState, middlewares);
};
