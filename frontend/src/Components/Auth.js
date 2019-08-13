import React, {useState} from 'react';
import styled from 'styled-components/macro';
import {Location, navigate} from '@reach/router';
import {SubmitButton} from '@cjdev/visual-stack/lib/components/Button';
import {getUser, saveUser} from '../userStorage';
import {authenticate} from '../api';
import {Title} from './Page';

const gitHash = () =>
  process.env.REACT_APP_GIT_HASH
    ? process.env.REACT_APP_GIT_HASH.substring(0, 8)
    : 'NO VERSION';

const Input = styled.input`
  padding: 5px;
  width: 200px;
  margin-right: 8px;
  border-radius: 3px;
`;

const LoginContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginForm = styled.form``;
const FormRow = styled.div`
  display: flex;
`;

const row2 = `
  min-height: 1.4em;
  display: flex;
  align-items: center;
  padding: 8px;
`;
const FormError = styled.div`
  ${row2};
  ${({theme}) => `
    background: ${theme.error.bg};
    color: ${theme.error.color};
  `};
  border-radius: 2px;
`;
const FormStatus = styled.div`
  ${row2};
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authState, setAuthState] = useState({
    pending: false,
    result: {},
  });
  const handleLogin = async pathname => {
    setAuthState({
      ...authState,
      pending: true,
      result: {},
    });
    const result = await authenticate(username, password);
    // console.log('authenticated: ', r);
    setAuthState({
      ...authState,
      pending: false,
      errorMessage: result.ok ? null : result.statusText,
      result,
    });
    if (result.ok) {
      saveUser(username);
      navigate(pathname);
    }
  };
  return (
    <Location>
      {({pathname}) => {
        return (
          <LoginContainer>
            <LoginForm
              onSubmit={ev => {
                ev.preventDefault();
                handleLogin(pathname);
              }}>
              <FormRow>
                <div title={gitHash()}>
                  <Title />
                </div>
              </FormRow>
              <FormRow>
                <Input
                  name="username"
                  placeholder="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
                <Input
                  type="password"
                  name="password"
                  placeholder="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <SubmitButton
                  type={
                    authState.pending ? 'outline-secondary' : 'solid-secondary'
                  }>
                  Login
                </SubmitButton>
              </FormRow>
              <FormRow>
                {authState.errorMessage ? (
                  <FormError>{authState.errorMessage}</FormError>
                ) : (
                  <FormStatus />
                )}
              </FormRow>
            </LoginForm>
          </LoginContainer>
        );
      }}
    </Location>
  );
};

export const Auth = ({children}) => {
  const user = getUser();
  return user ? children(user) : <Login />;
};
