import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ArticleEditPage from "main/pages/Articles/ArticleEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

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
    useParams: () => ({
      id: 17,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("ArticleEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/articles", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticleEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Article");
      expect(screen.queryByTestId("Article-name")).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/articles", { params: { id: 17 } }).reply(200, {
        id: "17",
        title: "How Birds Fly",
        url: "https://www.britannica.com/animal/bird-animal/Flight",
        explanation: "This is how birds fly...",
        email: "tuancle@ucsb.edu",
        dateAdded: "2025-04-29T05:31:00",
      });
      axiosMock.onPut("/api/articles").reply(200, {
        id: "17",
        title: "How Birds Fly (Changed)",
        url: "https://www.britannica.com/animal/bird-animal/Flights",
        explanation: "This is how birds fly... (Changed)",
        email: "tuancle@ucsb.edu (Changed)",
        dateAdded: "2027-04-29T05:31:00",
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticleEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("ArticleForm-id");

      const idField = screen.getByTestId("ArticleForm-id");
      const titleField = screen.getByTestId("ArticleForm-title");
      const urlField = screen.getByTestId("ArticleForm-url");
      const explanationField = screen.getByTestId("ArticleForm-explanation");
      const emailField = screen.getByTestId("ArticleForm-email");
      const dateAddedField = screen.getByTestId("ArticleForm-dateAdded");
      const submitButton = screen.getByTestId("ArticleForm-submit");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(titleField).toBeInTheDocument();
      expect(titleField).toHaveValue("How Birds Fly");
      expect(urlField).toBeInTheDocument();
      expect(urlField).toHaveValue(
        "https://www.britannica.com/animal/bird-animal/Flight",
      );
      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("This is how birds fly...");
      expect(emailField).toBeInTheDocument();
      expect(emailField).toHaveValue("tuancle@ucsb.edu");
      expect(dateAddedField).toBeInTheDocument();
      expect(dateAddedField).toHaveValue("2025-04-29T05:31");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(titleField, {
        target: { value: "How Birds Fly (Changed)" },
      });
      fireEvent.change(urlField, {
        target: {
          value: "https://www.britannica.com/animal/bird-animal/Flights",
        },
      });
      fireEvent.change(explanationField, {
        target: { value: "This is how birds fly... (Changed)" },
      });
      fireEvent.change(emailField, {
        target: { value: "tuancle@ucsb.edu (Changed)" },
      });
      fireEvent.change(dateAddedField, {
        target: { value: "2027-04-29T05:31:00" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Article Updated - id: 17 title: How Birds Fly (Changed)",
      );

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/articles" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: "17" });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          title: "How Birds Fly (Changed)",
          url: "https://www.britannica.com/animal/bird-animal/Flights",
          explanation: "This is how birds fly... (Changed)",
          email: "tuancle@ucsb.edu (Changed)",
          dateAdded: "2027-04-29T05:31",
        }),
      ); // posted object
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticleEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("ArticleForm-id");

      const idField = screen.getByTestId("ArticleForm-id");
      const titleField = screen.getByTestId("ArticleForm-title");
      const urlField = screen.getByTestId("ArticleForm-url");
      const explanationField = screen.getByTestId("ArticleForm-explanation");
      const emailField = screen.getByTestId("ArticleForm-email");
      const dateAddedField = screen.getByTestId("ArticleForm-dateAdded");
      const submitButton = screen.getByTestId("ArticleForm-submit");

      expect(idField).toHaveValue("17");
      expect(titleField).toHaveValue("How Birds Fly");
      expect(urlField).toHaveValue(
        "https://www.britannica.com/animal/bird-animal/Flight",
      );
      expect(explanationField).toHaveValue("This is how birds fly...");
      expect(emailField).toHaveValue("tuancle@ucsb.edu");
      expect(dateAddedField).toHaveValue("2025-04-29T05:31");
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(titleField, {
        target: { value: "How Birds Fly (Changed)" },
      });
      fireEvent.change(explanationField, {
        target: { value: "This is how birds fly... (Changed)" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Article Updated - id: 17 title: How Birds Fly (Changed)",
      );
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/articles" });
    });
  });
});
