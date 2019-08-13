import {path, findIndex, set, lensPath, view} from 'ramda';

const E1 = 'E1';
const E2 = 'E2';
const E3 = 'E3';
const A1 = 'A1';
const A2 = 'A2';
const A3 = 'A3';
const P1 = 'P1';
const P2 = 'P2';
const P3 = 'P3';
const M1 = 'M1';
const M2 = 'M2';
const M3 = 'M3';

// order the levels
export const levels = [E1, E2, E3, A1, A2, A3, P1, P2, P3, M1, M2, M3];

export const levelCats = ['Exposed', 'Apprentice', 'Practitioner', 'Master'];

export const getRelativeToExpected = (level, expectedLevel) => {
  if (!level || !expectedLevel) return 'MEETS';

  const levelIdx = findIndex(l => l === level)(levels);
  const expectedIdx = findIndex(l => l === expectedLevel)(levels);
  if (levelIdx > expectedIdx) return 'ABOVE';
  if (levelIdx < expectedIdx) return 'BELOW';
  return 'MEETS';
};

export const getLevelForEntry = (entry, level) =>
  level ? path([entry, level])(EntryLevelMap) : null;

export const getDescriptionForEntry = entry => EntryLevelMap[entry].desc;

const EntryLevelMap = {};
const m = (entry, se3, sse, pri, desc) => {
  EntryLevelMap[entry] = {
    SE3: se3,
    SSE: sse,
    PRI: pri,
    desc,
  };
};

const d = (entry, desc) => {
  EntryLevelMap[entry] = {
    ...EntryLevelMap[entry],
    desc,
  };
};

m(' - at teaching', A3, P2, P3);
// d(
//   ' - at teaching',
//   'This is a long description that includes a lot words and perhaps some 1,2,3 numbers and other things but definitely not any images because that would be silly and we are not being silly here.',
// );

m(' - at being an example for others', A2, P2, M1);
m(' - at building trust with others', A3, P2, M1);
m(' - at being a valued resource for others', A3, P2, M1);
m(' - at knowing when to ask others for help and advice', A2, P1, P3);
m(' - at setting the right tone', A3, P2, M2);
m(' - at maintaining high personal standards', A2, P1, P3);
m(' - at raising awareness in others', A2, P1, P3);
m(
  ' - at demonstrating leadership within the community outside of CJ (open source, blogs, talks, meetups, etc)',
  A2,
  P1,
  P3,
);

m(' - at understanding the business model', A2, P2, M2);
m(' - at improving the product', A3, P3, M2);
m(' - at supporting the product owner', A3, P2, M1);
m(' - at being aware of what is going on in the company', A2, P2, M1);
m(' - at being aware of what is going on with the product', A3, P3, M2);
m(' - at being aware of what other teams are working on', A2, P2, M2);

m(
  ' - at taking an interest in some aspect of our product and learning everything there is to know about it',
  A1,
  P1,
  M1,
);
m(' - at caring about the direction their project is going', A2, P3, M2);

m(' - at being curious', A3, P2, M1);

m(' - at knowing there is more to learn', A2, P2, M2);
m(' - at asking “why”', A1, P1, M1);
m(' - at taking care of problems without being told', A3, P1, M1);
m(' - at asking questions when things are unclear', A3, P2, P3);
m(' - is continually educating themselves, training & learning', A3, P2, M2);

m(' - at thinking long term', A3, P2, M1);
m(
  ' - at making the right decisions over the easy or fun decisions',
  P1,
  P3,
  M2,
);
m(' - at focusing on the customer’s needs & wants', A3, P2, M1);
m(' - at choosing simple solutions', A2, P2, M1);

m(' - at using the DSU to raise issues in a timely manner', A3, P3, M2);
m(
  ' - at providing constructive, timely and honest feedback in retrospectives',
  A3,
  P3,
  M2,
);
m(
  ' - at understanding the purpose of all the agile ceremonies/meetings',
  P1,
  P3,
  M2,
);
m(' - at keeping the agile meetings/mechanisms on track', A2, P3, M2);
m(' - at involving the product owner at just the right times', A2, P2, M1);

m(' - at showing up at all squad meetings', P1, P3, M2);
m(' - at showing up at all chapter meetings', P1, P3, M2);
m(' - at paying attention in meetings', P1, P3, M2);
m(' - at coordinating time-off with co-workers', A2, P1, M1);
m(' - at coming prepared to discuss the topic at hand', A2, P2, M1);

m(
  ' - at staying up to date with new and emerging technologies related to the chapter',
  A2,
  P2,
  M1,
);
m(
  ' - at offering solutions when problems arise with chapter-related concerns',
  A3,
  P3,
  M2,
);
m(
  ' - at actively defining the goals/tech/practices within the chapter',
  A3,
  P3,
  M2,
);
m(
  " - at actively working to move the department towards the goals/tech/practices we've agreed on in the chapter",
  A3,
  P3,
  M2,
);

m(" - at assisting squads with their chapter's technologies", A2, P2, M1);
m(
  " - at being a resource for their squad their chapter's technologies",
  A2,
  P2,
  M1,
);
m(' - at representing their squad in the chapter', A2, P2, M1);
m(
  ' - at seizing opportunities to take innovation from the squad level to the chapter as a whole',
  A2,
  P1,
  M1,
);
m(
  " - at seizing opportunities within chapters to advance the squad's mission",
  A2,
  P2,
  M1,
);

m(' - java', A3, P3, M2);
m(' - scala', A3, P2, M1);
m(' - clojure', A3, P2, M1);
m(' - javascript', A3, P3, M2);
m(' - haskell', A3, P2, M1);
m(' - SQL', A3, P3, M2);

m(' - at working in the IDE', A2, P1, P3);
m(' - at terminal-based editing', A3, P3, M2);
m(' - at working from the cli in general', A2, P2, M1);
m(' - at working with source control systems (e.g. git)', A3, P3, M2);
m(' - at working with build systems', A2, P2, M1);

m(' - at applying functional programming techniques/patterns', A2, P1, P3);
m(' - at applying object oriented programming techniques/patterns', A3, P3, M2);
m(
  ' - at understanding CPU/Network/Disk performance characteristics',
  A2,
  P2,
  M1,
);
m(' - at understanding & designing system architectures', A2, P2, M1);
m(
  ' - at assigning responsibilities to systems/classes/functions appropriately',
  P1,
  P3,
  M2,
);
m(' - at refactoring existing code', A2, P2, M1);
m(' - at identifying/using patterns', A2, P2, M1);
m(' - at writing self-documenting code', A3, P3, M2);

m(' - at TDD', P1, P3, M2);
m(' - at pair-programming', P1, P3, M2);
m(' - at applying CI/CD', A2, P2, M1);

// ===================================================
// Understands our data technologies
//
m(' - Using Avro for Schema Definition', A1, P1, M1);
m(' - Using Avro for Message Transport', A1, P1, M1);
m(' - Using Parquet as a Data Storage Format', A2, P2, M1);
m(' - Using Kafka for Data Transport', A2, P3, M1);
m(
  ' - Using Distributed Filesystem & Blob Storage for long-term data storage',
  A2,
  P3,
  M1,
);

m(' - Using Spark for offline Data Processing', A1, P1, M1);
m(' - Using Spark for Interactive Exploration', A2, P2, M1);
m(' - Using Data Presentation Technologies', A1, P1, M1);
m(' - Using Relational Databases & SQL', A1, P1, M1);
m(' - Creating backwards-compatible schema changes', A3, P3, M3);
m(' - Rules for legacy schema migrations', A3, P3, M3);

m(' - CJ Data Strategy', A1, P1, M1);
m(
  ' - Understanding the different database technologies, and their approprate application',
  A1,
  P1,
  M1,
);

// Understands our API technologies
//
m(
  ' - at following established guidelines and principles for providing and documenting APIs',
  A2,
  P2,
  M2,
);
m(
  ' - at following established guidelines and principles for consuming APIs',
  A2,
  P2,
  M2,
);
m(
  ' - at actively working to decouple the domains and maintain proper decoupling of the domains',
  A1,
  P2,
  M2,
);
m(' - REST at CJ', A1, P1, P2);
m(' - GraphQL', A1, P2, P2);

// ===================================================
// Understands our Front-end technologies
m(
  ' - Responsibly works to move our legacy front-end tech towards our current preferences',
  A2,
  P2,
  M2,
);
m(' - CSS', A1, P1, P3);
m(' - HTML', A2, P2, M2);
m(' - React', A2, P2, M2);
m(' - Redux', A2, P2, M1);
m(' - Visual Stack', A2, P2, M1);

// ===================================================
// Understands our secure coding & privacy technologies
//
m(' - Building secure web applications', E3, A3, P2);
m(' - Building secure APIs, back ends, and data layers', E3, A3, P2);
m(' - Credentials and key management', E3, A3, P3);
m(' - Dependency management', A1, P1, M1);
m(' - Authentication, authorization, and roles', E3, A3, P3);
m(" - Understanding CJ's security standards and guidelines", A1, P1, M1);
m(' - Discovering vulnerabilities and penetration testing', E2, A2, P1);
m(
  ' - Vulnerability scanning, logging, and system monitoring technology',
  E2,
  A2,
  P1,
);
m(' - Investigating security events, concerns, and threats', A2, P2, M2);
m(' - Assessing and measuring vulnerability risk', A2, P1, M1);
m(' - Responding appropriately to security risk', E3, A3, P3);
m(
  ' - Remediating vulnerabilities and hosts (patching, rekicking, decommissioning)',
  E3,
  A3,
  P3,
);

// ===================================================
// Understands and applies our operations technologies and standards
//
m(' - for working with the Convertant ITOPS organization', P2, P3, M1);
m(' - for devops', P3, M1, M2);
m(' - for operating Linux hosts', P3, M1, M1);
m(' - for developing and operating containers', P2, P3, M1);
m(
  ' - for building and deploying shared systems (Jenkins, SpeedyG, DeployAll)',
  P2,
  P2,
  P3,
);
m(' - for monitoring shared systems (SiMon, PagerDuty)', P2, P2, P3);
m(' - for AWS networking', P1, P3, M1);
m(' - for AWS architectures', P1, P3, M1);
m(' - for AWS services', P1, P2, P3);
m(' - for application continuity', P1, P3, M1);
m(' - for continuous delivery', P1, P3, M1);
m(' - for AWS management', E3, P1, P2);
m(' - for budgeting and financial accountability', E3, P1, P3);
m(' - for operational commitments (Audits, RFPs)', E3, P2, P3);
