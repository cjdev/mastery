import React from 'react';
import {navigate} from '@reach/router';
import {Button} from '@cjdev/visual-stack/lib/components/Button';
import {removeUser} from '../userStorage';

export const Logout = () => {
  const logout = () => {
    removeUser();
    navigate('/');
  };
  return (
    <Button type="outline-secondary" onClick={logout}>
      Logout
    </Button>
  );
};
