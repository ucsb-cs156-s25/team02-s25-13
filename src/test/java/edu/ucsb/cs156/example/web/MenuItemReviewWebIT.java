package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import java.time.LocalDateTime;

import edu.ucsb.cs156.example.WebTestCase;
import edu.ucsb.cs156.example.entities.MenuItemReview;
import edu.ucsb.cs156.example.repositories.MenuItemReviewRepository;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class MenuItemReviewWebIT extends WebTestCase {
    @Autowired
        MenuItemReviewRepository menuItemReviewRepository;
    @Test
    public void admin_user_can_create_edit_delete_menuitemreview() throws Exception {
        setupUser(true);

        LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

                MenuItemReview menuitemreview = MenuItemReview.builder()
                                .itemId(5L)
                                .reviewerEmail("cgaucho@ucsb.edu")
                                .stars(3)
                                .dateReviewed(ldt1)
                                .comments("It was ok")
                                .build();

                menuItemReviewRepository.save(menuitemreview);
        page.getByText("Menu Item Reviews").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-comments"))
                .hasText("It was ok");

        page.getByTestId("MenuItemReviewTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit MenuItemReview")).isVisible();
        page.getByLabel("comments").fill("THE BEST");
        page.getByText("Update").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-comments")).hasText("THE BEST");

        page.getByTestId("MenuItemReviewTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-comments")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_menuitemreview() throws Exception {
        setupUser(false);

        page.getByText("Menu Item Reviews").click();

        assertThat(page.getByText("Create MenuItemReview")).not().isVisible();
        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-name")).not().isVisible();
    }
}
