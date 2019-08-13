import {buildFeedback} from '../buildFeedback';
import {UNKNOWN} from '../../../utils';

const subject = 'a@b.com';
const state = {
  entries: [],
  categoryComments: [],
};
describe('buildFeedback', () => {
  it('should return subject', () => {
    const result = buildFeedback(subject, state);
    expect(result.subject).toBe(subject);
  });

  it('should exclude entries with no data', () => {
    const result = buildFeedback(subject, {
      ...state,
      entries: {
        ' - not-a-value': {},
      },
    });
    expect(result.items).toEqual({});
  });

  it('should include entries with position data', () => {
    const result = buildFeedback(subject, {
      ...state,
      entries: {
        ' - something': {scaledInLevel: 'Master-99'},
        ' - not-a-value': {},
      },
    });
    expect(result.items).toEqual({' something': 'Master-99'});
  });

  it('should include entries with NA marker', () => {
    const result = buildFeedback(subject, {
      ...state,
      entries: {
        ' - something': UNKNOWN,
        ' - not-a-value': {},
      },
    });
    expect(result.items).toEqual({' something': UNKNOWN});
  });

  it('should return all non-empty comments', () => {
    const result = buildFeedback(subject, {
      ...state,
      categoryComments: {a: '', b: 'not-empty', c: null, d: undefined},
    });
    expect(result.comments).toEqual({b: 'not-empty'});
  });
});
