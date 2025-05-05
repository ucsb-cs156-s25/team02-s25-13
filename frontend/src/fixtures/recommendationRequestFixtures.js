const recommendationRequestFixtures = {
  oneRecommendationRequest: {
    id: 1,
    requesterEmail: "test",
    professorEmail: "test",
    explanation: "testing",
    dateRequested: "1111-11-11T11:11:11",
    dateNeeded: "1111-11-11T11:11:11",
    done: true,
  },
  threeRecommendationRequests: [
    {
      id: 1,
      requesterEmail: "test",
      professorEmail: "tests",
      explanation: "testing",
      dateRequested: "1111-11-11T11:11:11",
      dateNeeded: "1111-11-11T11:11:12",
      done: true,
    },
    {
      id: 2,
      requesterEmail: "best",
      professorEmail: "best",
      explanation: "best",
      dateRequested: "1111-11-11T11:11:13",
      dateNeeded: "1111-11-11T11:11:14",
      done: false,
    },
    {
      id: 3,
      requesterEmail: "nest",
      professorEmail: "nest",
      explanation: "nest",
      dateRequested: "1111-11-11T11:11:15",
      dateNeeded: "1111-11-11T11:11:16",
      done: false,
    },
  ],
};

export { recommendationRequestFixtures };
