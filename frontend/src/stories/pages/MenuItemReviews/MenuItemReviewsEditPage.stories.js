import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import MenuItemReviewsEditPage from "main/pages/MenuItemReviews/MenuItemReviewsEditPage";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";

export default {
  title: "pages/MenuItemReviews/MenuItemReviewsEditPage",
  component: MenuItemReviewsEditPage,
};

const Template = () => <MenuItemReviewsEditPage storybook={true} />;

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
    http.get("/api/menuitemreviews", () => {
      return HttpResponse.json(menuItemReviewFixtures.threeMenuItemReviews[0], {
        status: 200,
      });
    }),
    // http.put("/api/menuitemreviews", () => {
    //   return HttpResponse.json({}, { status: 200 });
    // }),
    http.put("/api/menuitemreviews", () => {
      // window.alert("PUT: " + req.url + " and body: " + req.body);
      return HttpResponse.json(
        {
          id: 17,
          itemID: 1,
          reviewerEmail: "cgaucho@ucsb.edu",
          stars: "3",
          dateReviewed: "2025-05-08T11:05",
          comments: "mac and cheese needs more cheese",
        },
        { status: 200 },
      );
    }),
  ],
};
