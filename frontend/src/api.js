import {parseTemplate} from './templateParser';

export const authenticate = async (username, password) => {
  return fetch('/api/tokens', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: `${username}:${password}`,
  });
};

export const fetchTemplate = async () =>
  fetch('/api/template')
    .then(result => {
      if (result.status !== 200) {
        throw new Error(result.statusText);
      }
      return result.text();
    })
    .then(text => parseTemplate(text));

export const fetchAssignments = async user => {
  // console.log('[api.fetchAssignments] user: ', user);
  return fetch(`/api/assignments/${user}`, {
    credentials: 'include',
  })
    .then(result => {
      // console.log('[api.fetchAssignments] result: ', result);
      if (result.status !== 200) {
        throw new Error('bad status = ' + result.status);
      }
      return result.json();
    })
    .then(data => data.assignments);
};

export const fetchFeedback = async (source, subject) => {
  const sub = subject || source;
  return fetch(`/api/feedback/${source}/${sub}`, {
    credentials: 'include',
  }).then(result => {
    // console.log('[api.fetchFeedback] result: ', result);
    if (result.status === 404)
      return {
        items: {},
        comments: {},
      };
    if (result.status !== 200) {
      throw new Error('bad status = ' + result.status);
    }
    return result.json();
  });
};

export const saveFeedback = async feedback => {
  console.log('feedback: ', JSON.stringify(feedback, null, 1));
  return fetch('/api/feedback', {
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify(feedback),
  }).then(result => {
    if (result.status !== 201) {
      throw new Error('bad status = ' + result.status);
    }
    return result;
  });
};
