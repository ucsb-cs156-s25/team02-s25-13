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

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class ArticlesWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_article() throws Exception {
        setupUser(true);

        page.getByText("Articles").click();

        page.getByText("Create Article").click();
        assertThat(page.getByText("Create New Article")).isVisible();
        page.getByLabel("Title").fill("How Birds Fly");
        page.getByLabel("Url").fill("https://www.britannica.com/animal/bird-animal/Flight");
        page.getByLabel("Explanation").fill("This is how birds fly...");
        page.getByLabel("Email").fill("tuancle@ucsb.edu");
        page.getByLabel("Date Added(iso format)").fill("2025-04-29T05:31");
        page.getByTestId("ArticleForm-submit").click();

        assertThat(page.getByTestId("ArticleTable-cell-row-0-col-title"))
                .hasText("How Birds Fly");

        page.getByTestId("ArticleTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit Article")).isVisible();
        page.getByTestId("ArticleForm-title").fill("How Birds Really Fly");
        page.getByTestId("ArticleForm-submit").click();

        assertThat(page.getByTestId("ArticleTable-cell-row-0-col-title")).hasText("How Birds Really Fly");

        page.getByTestId("ArticleTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("ArticleTable-cell-row-0-col-title")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_article() throws Exception {
        setupUser(false);

        page.getByText("Articles").click();

        assertThat(page.getByText("Create Article")).not().isVisible();
    }

    @Test
    public void regular_user_can_see_create_article() throws Exception {
        setupUser(true);

        page.getByText("Articles").click();

        assertThat(page.getByText("Create Article")).isVisible();
    }
}