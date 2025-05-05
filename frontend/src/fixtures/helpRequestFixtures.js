const helpRequestFixtures = {
  oneHelpRequest: [
    {
      id: 1,
      requesterEmail: "johndoe@gmail.com",
      teamId: "team1",
      tableOrBreakoutRoom: "13",
      requestTime: "2022-01-02T12:00:00",
      explanation: "none",
      solved: false,
    },
  ],
  threeHelpRequests: [
    {
      id: 1,
      requesterEmail: "johndoe@gmail.com",
      teamId: "team1",
      tableOrBreakoutRoom: "13",
      requestTime: "2022-01-02T12:00:00",
      explanation: "none",
      solved: false,
    },
    {
      id: 2,
      requesterEmail: "janedoe@gmail.com",
      teamId: "team2",
      tableOrBreakoutRoom: "12",
      requestTime: "2022-04-03T12:00:00",
      explanation: "none",
      solved: false,
    },
    {
      id: 3,
      requesterEmail: "maedoe@gmail.com",
      teamId: "team3",
      tableOrBreakoutRoom: "11",
      requestTime: "2022-07-04T12:00:00",
      explanation: "none",
      solved: false,
    },
  ],
};

export { helpRequestFixtures };
