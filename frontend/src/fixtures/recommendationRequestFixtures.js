const recommendationRequestFixtures = {
  oneDate: {
    id: 1,
    requesterEmail: "test",
    professorEmail: "test",
    explanation: "testing",
    dateRequested: "1111-11-11T11:11:11",
    dateNeeded: "1111-11-11T11:11:11",
    done: true,
  },
  threeDates: [
    {
      id: 1,
      requesterEmail: "test",
      professorEmail: "test",
      explanation: "testing",
      dateRequested: "1111-11-11T11:11:11",
      dateNeeded: "1111-11-11T11:11:11",
      done: true,
    },
    {
      id: 2,
      requesterEmail: "best",
      professorEmail: "best",
      explanation: "best",
      dateRequested: "1111-11-11T11:11:11",
      dateNeeded: "1111-11-11T11:11:11",
      done: false,
    },
    {
      id: 3,
      requesterEmail: "nest",
      professorEmail: "nest",
      explanation: "nest",
      dateRequested: "1111-11-11T11:11:11",
      dateNeeded: "1111-11-11T11:11:11",
      done: false,
    },
  ],
};

export { recommendationRequestFixtures };
