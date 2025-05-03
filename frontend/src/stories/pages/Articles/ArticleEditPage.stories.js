import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import ArticleEditPage from "main/pages/Articles/ArticleEditPage";
import { articleFixtures } from "fixtures/articleFixtures";

export default {
  title: "pages/Articles/ArticleEditPage",
  component: ArticleEditPage,
};

const Template = () => <ArticleEditPage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.get("/api/articles", () => {
      return HttpResponse.json(articleFixtures.threeArticles[0], {
        status: 200,
      });
    }),
    http.put("/api/articles", () => {
      return HttpResponse.json(
        {
          id: 1,
          title: "How Birds Fly",
          url: "https://www.britannica.com/animal/bird-animal/Flight",
          explanation: "This is how birds fly...",
          email: "tuancle@ucsb.edu",
          dateAdded: "2025-04-29T05:31:00",
        },
        { status: 200 },
      );
    }),
  ],
};
