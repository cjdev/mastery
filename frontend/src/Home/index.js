import React from 'react';
import styled from 'styled-components/macro';
import {useAsync} from 'react-async-hook';
import {Auth} from '../Components/Auth';
import {NavLink} from '../Components/Nav';
import Page from '../Components/Page';
import {fetchAssignments} from '../api';

const AssignmentLink = styled(NavLink)`
  margin-left: 0;
`;

const AssignmentsList = styled.div`
  max-width: 30%;
`;

const AssignmentRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
`;

const AssignmentStatus = styled.div`
  padding: 8px;
`;

const Assignment = ({subject, user}) => (
  <AssignmentRow>
    <AssignmentLink to={`/mastery/${user}/${subject.name}`}>
      {subject.name}
    </AssignmentLink>
    <AssignmentStatus>{subject.status}</AssignmentStatus>
  </AssignmentRow>
);

const Home = ({user}) => {
  const {loading, error, result: assignments} = useAsync(fetchAssignments, [
    user,
  ]);
  return (
    <Page>
      {loading && <div>Loading...</div>}
      {error && <div>ERROR</div>}
      {assignments && (
        <AssignmentsList>
          {assignments.map((a, i) => (
            <Assignment key={i} subject={a} user={user} />
          ))}
        </AssignmentsList>
      )}
    </Page>
  );
};

export default () => <Auth>{user => <Home user={user} />}</Auth>;
