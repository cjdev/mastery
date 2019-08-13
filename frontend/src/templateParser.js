import {isNil, reduce} from 'ramda';

const GROUP = 'GROUP';
const BLANK = 'BLANK';
const CATEG = 'CATEG';
const ENTRY = 'ENTRY';

const typeOf = line => {
  if (/^=====/.test(line)) {
    return GROUP;
  } else if (/^\s*$/.test(line)) {
    return BLANK;
  } else if (/^ -/.test(line)) {
    return ENTRY;
  } else {
    return CATEG;
  }
};

export const parseTemplate = templateText => {
  if (isNil(templateText)) return null;

  const data = reduce(
    (acc, line) => {
      // console.log('line: ', line, acc);
      const {allEntries, categoryComments, state, template} = acc;
      switch (typeOf(line)) {
        case GROUP:
          template[line] = {};
          state.currentGroup = line;
          break;
        case CATEG:
          template[state.currentGroup][line] = [];
          state.currentCateg = line;
          categoryComments[line] = '';
          break;
        case ENTRY:
          template[state.currentGroup][state.currentCateg].push(line);
          allEntries[line] = {};
          break;
        default:
          // noop
          break;
      }
      return {
        allEntries,
        categoryComments,
        state,
        template,
      };
    },
    {
      allEntries: {},
      categoryComments: {},
      state: {},
      template: {},
    },
    templateText.split('\n'),
  );
  return {
    template: data.template,
    allEntries: data.allEntries,
    categoryComments: data.categoryComments,
  };
};
