import React from 'react';
import * as R from 'ramda';
import {Auth} from '../Components/Auth';
import Page from '../Components/Page';
import {FeedbackForm} from './FeedbackForm';
import {ProgressHeader} from './ProgressHeader';
import {FormProvider, FormConsumer} from './FormContext';
import {Spiel} from './Spiel';

const validUserSubjectCombination = (
  user,
  source,
  subject,
  assignments = [],
) => {
  // Case 1: logged in user assessing themself
  if (user === source && !subject) return true;
  if (user === source && subject === source) return true;

  // Case 2: logged in user assessing one of their assignments
  return !!R.find(R.propEq('name', subject))(assignments);
};
const InvalidUserSubject = () => <div>INVALID</div>;

const Mastery = ({user, source, subject}) => {
  const isValid = assignments =>
    validUserSubjectCombination(user, source, subject, assignments);

  return (
    <FormProvider user={user} source={source} subject={subject}>
      <FormConsumer>
        {({assignments}) => (
          <Page>
            {isValid(assignments) ? (
              <>
                <ProgressHeader user={user} subject={subject} />
                <Spiel />
                <FeedbackForm />
              </>
            ) : (
              <InvalidUserSubject />
            )}
          </Page>
        )}
      </FormConsumer>
    </FormProvider>
  );
};

export default props => (
  <Auth>{user => <Mastery {...props} user={user} />}</Auth>
);
