import React from 'react';
import styled from 'styled-components/macro';

const Quote = styled.blockquote`
  font-style: italic;
`;
const Container = styled.div`
  text-align: justify;
  line-height: 1.4em;
`;

export const Spiel = () => (
  <Container>
    <Quote>
      "What would it look like if we re-oriented all aspects of the lifecycle of
      interviewing, onboarding, training, reviews and career development around
      a unified concept of becoming a practicing master of code craft?"
    </Quote>
    <p>
      This is the question that drove the creation of this "path to mastery"
      chart; a clear breakdown of all the aspects of mastery that we're seeking
      to cultivate, and a means of charting our progress toward that end.
    </p>

    <p>
      You'll notice that many (most?) of the aspects on this chart are "soft"
      skills. This is because, while the ability to code an algorithm is
      necessary, mastery goes far beyond this into the realm of teamwork. How
      one works with others is even more impactful than writing good code.
    </p>

    <p>
      Our hope is that, starting with interviewing and proceeding throughout
      your career, this chart will be a clear and useful guide as we seek to
      grow you into the best you can possibly be.
    </p>
  </Container>
);
