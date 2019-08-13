import {handleUpdateEntry} from '../handlers';
import {UNKNOWN} from '../../../utils';

const state = {
  entries: {
    ENTRY1: {},
    ENTRY2: {},
  },
  progress: 0,
};

describe('handlers', () => {
  describe('handleUpdateEntry', function() {
    it('should update entry and progress when new position', function() {
      const action = {
        payload: {
          entry: 'ENTRY1',
          data: {position: 11, scaledInLevel: 'Master-99'},
        },
      };

      const newState = handleUpdateEntry(state, action);

      expect(newState.entries[action.payload.entry]).toBe(action.payload.data);
      expect(newState.progress).toBe(50);
    });

    it('should update entry and progress when NA marker', function() {
      const action = {
        payload: {
          entry: 'ENTRY1',
          data: UNKNOWN,
        },
      };

      const newState = handleUpdateEntry(state, action);

      expect(newState.entries[action.payload.entry]).toBe(action.payload.data);
      expect(newState.progress).toBe(50);
    });
  });
});
