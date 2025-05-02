import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewsCreatePage from "main/pages/MenuItemReviews/MenuItemReviewsCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("MenuItemReviewsCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("comments")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /menuitemreviews", async () => {
    const queryClient = new QueryClient();
    const menuitemreview = {
      id: 3,
      itemId: 1,
      reviewerEmail: "cgaucho@ucsb.edu",
      stars: 5,
      dateReviewed: "2025-05-08T11:05:00",
      comments: "Great food!",
    };

    axiosMock.onPost("/api/menuitemreviews/post").reply(202, menuitemreview);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("itemId")).toBeInTheDocument();
    });

    const itemIdInput = screen.getByLabelText("itemId");
    expect(itemIdInput).toBeInTheDocument();

    const reviewerEmailInput = screen.getByLabelText("reviewerEmail");
    expect(reviewerEmailInput).toBeInTheDocument();

    const starsInput = screen.getByLabelText("stars");
    expect(starsInput).toBeInTheDocument();

    const dateReviewedInput = screen.getByLabelText(
      "dateReviewed (iso format)",
    );
    expect(dateReviewedInput).toBeInTheDocument();

    const commentsInput = screen.getByLabelText("comments");
    expect(commentsInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(itemIdInput, { target: { value: 1 } });
    fireEvent.change(reviewerEmailInput, {
      target: { value: "cgaucho@ucsb.edu" },
    });
    fireEvent.change(starsInput, { target: { value: 5 } });
    fireEvent.change(dateReviewedInput, {
      target: { value: "2025-05-08T11:05:00" },
    });
    fireEvent.change(commentsInput, { target: { value: "Great food!" } });
    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      itemID: "1",
      reviewerEmail: "cgaucho@ucsb.edu",
      stars: "5",
      reviewDate: "2025-05-08T11:05",
      comments: "Great food!",
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toHaveBeenCalledWith(
      "New review created - id: 3 comments: Great food!",
    );
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/menuitemreviews" });
  });
});
