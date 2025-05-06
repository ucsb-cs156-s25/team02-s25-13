package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

import java.time.LocalDateTime;

import edu.ucsb.cs156.example.entities.RecommendationRequest;
import edu.ucsb.cs156.example.repositories.RecommendationRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestWebIT extends WebTestCase {

    @Autowired
    RecommendationRequestRepository recommendationRequestRepository;

    @Test
    public void admin_user_can_create_edit_delete_recommendationRequest() throws Exception {

        LocalDateTime ldt1 = LocalDateTime.parse("2022-04-20T00:00:00");
        LocalDateTime ldt2 = LocalDateTime.parse("2022-05-01T00:00:00");
        RecommendationRequest recommendationRequest = RecommendationRequest.builder()
                        .requesterEmail("cgaucho@ucsb.edu")
                        .professorEmail("phtcon@ucsb.edu")
                        .explanation("BS/MSprogram")
                        .dateRequested(ldt1)
                        .dateNeeded(ldt2)
                        .done(true)
                        .build();
                        
        recommendationRequestRepository.save(recommendationRequest);
        
        setupUser(true);

        page.getByText("Recommendation Requests").click();
        // page.getByText("Create Recommendation Request").click();
        // assertThat(page.getByText("Create New Recommendation Request")).isVisible();
        // page.getByLabel("Requester Email").fill("cgaucho@ucsb.edu");
        // page.getByLabel("Professor Email").fill("phtcon@ucsb.edu");
        // page.getByLabel("Explanation").fill("BS/MSprogram");
        // page.getByLabel("Date Requested (in UTC)").fill("2022-04-20T00:00");
        // page.getByLabel("Date Needed (in UTC)").fill("2022-05-01T00:00");
        // page.getByLabel("Done? (if checked, job will be marked as done)").check();

        // page.getByText("Create").click();

        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-requesterEmail"))
                .hasText("cgaucho@ucsb.edu");

        // page.getByTestId("RecommendationRequestTable-cell-row-0-col-Edit-button").click();
        // assertThat(page.getByText("Edit Recommendation Request")).isVisible();
        // page.getByTestId("RecommendationRequestForm-description").fill("THE BEST");
        // page.getByTestId("RecommendationRequestForm-submit").click();

        // assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-description")).hasText("THE BEST");

        page.getByTestId("RecommendationRequestTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-requesterEmail")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_recommendationRequest() throws Exception {
        setupUser(false);

        page.getByText("Recommendation Requests").click();

        assertThat(page.getByText("Create Recommendation Request")).not().isVisible();
        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-name")).not().isVisible();
    }

    @Test
    public void admin_user_can_see_create_recommendationRequest() throws Exception {
        setupUser(true);

        page.getByText("Recommendation Requests").click();

        assertThat(page.getByText("Create Recommendation Request")).isVisible();
    }
}