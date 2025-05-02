import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";

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

describe("RecommendationRequestEditPage tests", () => {
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
      axiosMock.onGet("/api/recommendationRequest", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Recommendation Request");
      expect(screen.queryByTestId("RecommendationRequest-requesterEmail")).not.toBeInTheDocument();
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
      axiosMock.onGet("/api/recommendationRequest", { params: { id: 17 } }).reply(200, {
        id: 17,
        requesterEmail: "test",
        professorEmail: "tests",
        explanation: "testing",
        dateRequested: "1111-11-11T11:11:11",
        dateNeeded: "1111-11-11T11:11:12",
        done: true,
      });
      axiosMock.onPut("/api/recommendationRequest").reply(200, {
        id: "17",
        requesterEmail: "best",
        professorEmail: "best",
        explanation: "best",
        dateRequested: "1111-11-11T11:11:13",
        dateNeeded: "1111-11-11T11:11:14",
        done: false,
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("RecommendationRequestForm-id");

      const idField = screen.getByLabelText("Id");
      const requesterEmailField = screen.getByLabelText("Requester Email");
      const professorEmailField = screen.getByLabelText("Professor Email");
      const explanationField = screen.getByLabelText("Explanation");
      const dateRequestedField = screen.getByLabelText("Date Requested (in UTC)");
      const dateNeededField = screen.getByLabelText("Date Needed (in UTC)");
      const doneField = screen.getByLabelText("Done? (if checked, job will be marked as done)");
      const submitButton = screen.getByText("Update");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");

      expect(requesterEmailField).toBeInTheDocument();
      expect(requesterEmailField).toHaveValue("test");

      expect(professorEmailField).toBeInTheDocument();
      expect(professorEmailField).toHaveValue("tests");

      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("testing");
      
      expect(dateRequestedField).toBeInTheDocument();
      expect(dateRequestedField).toHaveValue("1111-11-11T11:11:11.000");
      
      expect(dateNeededField).toBeInTheDocument();
      expect(dateNeededField).toHaveValue("1111-11-11T11:11:12.000");

      expect(doneField).toBeInTheDocument();
      expect(doneField).toBeChecked();
      
      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(requesterEmailField, {
        target: { value: "best" },
      });
      fireEvent.change(professorEmailField, {
        target: { value: "best" },
      });
      fireEvent.change(explanationField, {
        target: { value: "best" },
      });
      fireEvent.change(dateRequestedField, {
        target: { value: "1111-11-11T11:11:13" },
      });
      fireEvent.change(dateNeededField, {
        target: { value: "1111-11-11T11:11:14" },
      });
      fireEvent.change(doneField, {
        target: { value: false },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Recommendation Request Updated - id: 17 requesterEmail: best",
      );

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/recommendationRequest" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "best",
          professorEmail: "best",
          explanation: "best",
          dateRequested: "1111-11-11T11:11:13.000",
          dateNeeded: "1111-11-11T11:11:14.000",
          done: true,
        }),
      ); // posted object
    });

    // test("Changes when you click Update", async () => {
    //   render(
    //     <QueryClientProvider client={queryClient}>
    //       <MemoryRouter>
    //         <RestaurantEditPage />
    //       </MemoryRouter>
    //     </QueryClientProvider>,
    //   );

    //   await screen.findByTestId("RecommendationRequestForm-id");

    //   const idField = screen.getByLabelText("RecommendationRequestForm-id");
    //   const nameField = screen.getByLabelText("RecommendationRequestForm-name");
    //   const descriptionField = screen.getByLabelText("RecommendationRequestForm-description");
    //   const submitButton = screen.getByLabelText("RecommendationRequestForm-submit");

    //   expect(idField).toHaveValue("17");
    //   expect(nameField).toHaveValue("Freebirds");
    //   expect(descriptionField).toHaveValue("Burritos");
    //   expect(submitButton).toBeInTheDocument();

    //   fireEvent.change(nameField, {
    //     target: { value: "Freebirds World Burrito" },
    //   });
    //   fireEvent.change(descriptionField, { target: { value: "Big Burritos" } });

    //   fireEvent.click(submitButton);

    //   await waitFor(() => expect(mockToast).toHaveBeenCalled());
    //   expect(mockToast).toHaveBeenCalledWith(
    //     "Restaurant Updated - id: 17 name: Freebirds World Burrito",
    //   );
    //   expect(mockNavigate).toHaveBeenCalledWith({ to: "/restaurants" });
    // });
  });
});
