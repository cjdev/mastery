import React from 'react';
import {useAsync} from 'react-async-hook';
import {isMgr} from './teamLeads.js';
import {getLevelForEntry, getDescriptionForEntry} from './EntryLevelMap';
import {fetchTemplate, fetchAssignments, fetchFeedback} from '../api';
import {useMasteryReducer} from './reducer';
import * as actions from './reducer/actions';
import {FullPageSpinner} from '../Components/Spinner';

let FormContext;

const {Provider, Consumer} = (FormContext = React.createContext());

const FormProvider = ({user, source, subject, children}) => {
  // const [state, dispatch] = useReducer(reducer, initialState, DEBUG_REDUCER);
  const [state, dispatch] = useMasteryReducer();
  const template = useAsync(
    () =>
      fetchTemplate().then(t => {
        dispatch(actions.setTemplate(t.template));
        dispatch(actions.setEntries(t.allEntries));
        dispatch(actions.setCategoryComments(t.categoryComments));
        return true;
      }),
    [],
  );
  const existingFeedback = useAsync(
    () =>
      fetchFeedback(source, subject).then(f => {
        dispatch(actions.setInitialFeedback(f));
        return true;
      }),
    [source, subject],
  );
  const assignments = useAsync(
    () =>
      fetchAssignments(user).then(a => {
        dispatch(actions.setAssignments(a));
        return a;
      }),
    [user],
  );

  const loading =
    assignments.loading || existingFeedback.loading || template.loading;

  return (
    <>
      {loading && <FullPageSpinner />}
      {assignments.error && <div>{assignments.error.message}</div>}
      {assignments.result && (
        <Provider value={getContextValue(state, dispatch, user)}>
          {children}
        </Provider>
      )}
    </>
  );
};

const getContextValue = (state, dispatch, user) => {
  return {
    assignments: state.assignments,
    template: state.template,
    categories: state.categories,
    feedback: state.feedback,
    progress: state.progress,
    allEntries: state.entries,
    updateEntry: (entry, data) => dispatch(actions.updateEntry({entry, data})),
    getLevelForEntry: entry => getLevelForEntry(entry, state.level),
    getDescriptionForEntry,
    level: state.level,
    setLevel: level => dispatch(actions.updateLevel(level)),
    isMgr: () => isMgr(user),

    getCategoryComment: category => state.categoryComments[category],
    updateCategoryComment: (category, comment) => {
      dispatch(actions.updateCategoryComment({category, comment}));
    },
    saveFeedback: subject => dispatch(actions.saveFeedback(subject)),
    saveState: state.save,
  };
};

export {FormProvider, Consumer as FormConsumer, FormContext};
