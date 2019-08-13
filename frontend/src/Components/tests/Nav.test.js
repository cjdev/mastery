import React from 'react';
import {render} from 'test-utils';
import Nav from '../Nav';

import {getUser} from '../../userStorage';
jest.mock('../../userStorage');

const mockUser = 'fhwrdh';
getUser.mockImplementation(() => mockUser);

describe('<Nav/>', () => {
  it('should render home link', function() {
    const {getByText} = render(<Nav />);
    expect(getByText(/home/i)).toBeTruthy();
  });

  it('should render user link', function() {
    const {getByText} = render(<Nav />);
    const {href} = getByText(mockUser);
    expect(href).toMatch(`/mastery/${mockUser}`);
  });

  it('should render logout link', function() {
    const {getByText} = render(<Nav />);
    expect(getByText(/logout/i)).toBeTruthy();
  });
});
