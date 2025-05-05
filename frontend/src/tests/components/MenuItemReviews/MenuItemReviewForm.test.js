import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import MenuItemReviewFormForm from "main/components/MenuItemReviews/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("MenuItemReviewForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "itemId",
    "reviewerEmail",
    "stars",
    "dateReviewed (iso format)",
    "comments",
  ];
  const testId = "MenuItemReviewForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewFormForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewFormForm
            initialContents={menuItemReviewFixtures.oneMenuItemReview}
          />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByText(`Id`)).toBeInTheDocument();

    expect(await screen.findByTestId(`${testId}-itemId`)).toBeInTheDocument();
    expect(screen.getByText(`itemId`)).toBeInTheDocument();

    expect(
      await screen.findByTestId(`${testId}-reviewerEmail`),
    ).toBeInTheDocument();
    expect(screen.getByText(`reviewerEmail`)).toBeInTheDocument();

    expect(await screen.findByTestId(`${testId}-stars`)).toBeInTheDocument();
    expect(screen.getByText(`stars`)).toBeInTheDocument();

    expect(
      await screen.findByTestId(`${testId}-dateReviewed`),
    ).toBeInTheDocument();
    expect(screen.getByText(`dateReviewed (iso format)`)).toBeInTheDocument();

    expect(await screen.findByTestId(`${testId}-comments`)).toBeInTheDocument();
    expect(screen.getByText(`comments`)).toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewFormForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewFormForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/ItemId is required/);
    expect(screen.getByText(/ReviewerEmail is required/)).toBeInTheDocument();
    expect(screen.getByText(/Stars are required/)).toBeInTheDocument();
    expect(screen.getByText(/DateReviewed is required/)).toBeInTheDocument();
    expect(screen.getByText(/Comments are required/)).toBeInTheDocument();

    const commentsInput = screen.getByTestId(`${testId}-comments`);
    fireEvent.change(commentsInput, { target: { value: "a".repeat(256) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Max length 255 characters for comments/),
      ).toBeInTheDocument();
    });

    const itemIdInput = screen.getByTestId(`${testId}-itemId`);
    fireEvent.change(itemIdInput, { target: { value: "a".repeat(256) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Max length 255 characters for itemId/),
      ).toBeInTheDocument();
    });

    const reviewerEmailInput = screen.getByTestId(`${testId}-reviewerEmail`);
    fireEvent.change(reviewerEmailInput, {
      target: { value: "a".repeat(256) },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Max length 255 characters for email/),
      ).toBeInTheDocument();
    });

    const starsInput = screen.getByTestId(`${testId}-stars`);
    fireEvent.change(starsInput, { target: { value: 0 } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Stars must be at least 1/)).toBeInTheDocument();
    });

    const starsInput2 = screen.getByTestId(`${testId}-stars`);
    fireEvent.change(starsInput2, { target: { value: 6 } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Stars must be at most 5/)).toBeInTheDocument();
    });
  });

  test("that submitAction is called with correct data when form is submitted", async () => {
    const mockSubmit = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewFormForm submitAction={mockSubmit} />
        </Router>
      </QueryClientProvider>,
    );

    fireEvent.change(screen.getByTestId(`${testId}-itemId`), {
      target: { value: "100" },
    });

    fireEvent.change(screen.getByTestId(`${testId}-reviewerEmail`), {
      target: { value: "reviewer@example.com" },
    });

    fireEvent.change(screen.getByTestId(`${testId}-stars`), {
      target: { value: "5" },
    });

    fireEvent.change(screen.getByTestId(`${testId}-dateReviewed`), {
      target: { value: "2024-05-01T12:00" },
    });

    fireEvent.change(screen.getByTestId(`${testId}-comments`), {
      target: { value: "Excellent!" },
    });

    const submitButton = screen.getByTestId(`${testId}-submit`);
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          itemId: "100",
          reviewerEmail: "reviewer@example.com",
          stars: "5",
          dateReviewed: "2024-05-01T12:00",
          comments: "Excellent!",
        }),
        expect.any(Object), // second argument is the event, we don't care about it
      ),
    );
  });
});
