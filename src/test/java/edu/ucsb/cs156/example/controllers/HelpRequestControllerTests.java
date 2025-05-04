package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.HelpRequest;
import edu.ucsb.cs156.example.repositories.HelpRequestRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;
import org.mockito.ArgumentCaptor;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.time.LocalDateTime;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = HelpRequestController.class)
@Import(TestConfig.class)
public class HelpRequestControllerTests extends ControllerTestCase {

        @MockBean
        HelpRequestRepository helpRequestRepository;

        @MockBean
        UserRepository userRepository;

        // Authorization tests for /api/helprequest/admin/all

        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/helprequest/all"))
                                .andExpect(status().is(403)); // logged out users can't get all
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_can_get_all() throws Exception {
                mockMvc.perform(get("/api/helprequest/all"))
                                .andExpect(status().is(200)); // logged
        }

        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/helprequest?id=7"))
                                .andExpect(status().is(403)); // logged out users can't get by id
        }

        // Authorization tests for /api/helprequest/post
        // (Perhaps should also have these for put and delete)

        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/helprequest/post"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_regular_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/helprequest/post"))
                                .andExpect(status().is(403)); // only admins can post
        }

        // // Tests with mocks for database actions

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

                // arrange
                LocalDateTime ldt = LocalDateTime.parse("2022-01-03T00:00:00");

                HelpRequest helpRequest = HelpRequest.builder()
                                .requesterEmail("requesterTest")
                                .teamId("teamIdTest")
                                .tableOrBreakoutRoom("tableOrBreakoutRoomTest")
                                .requestTime(ldt)
                                .explanation("explanation")
                                .solved(false)
                                .build();

                when(helpRequestRepository.findById(eq(7L))).thenReturn(Optional.of(helpRequest));

                // act
                MvcResult response = mockMvc.perform(get("/api/helprequest?id=7"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(helpRequestRepository, times(1)).findById(eq(7L));
                String expectedJson = mapper.writeValueAsString(helpRequest);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(helpRequestRepository.findById(eq(7L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/helprequest?id=7"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(helpRequestRepository, times(1)).findById(eq(7L));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("HelpRequest with id 7 not found", json.get("message"));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_helprequest() throws Exception {

                // arrange
                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

                HelpRequest helpRequest1 = HelpRequest.builder()
                                .requesterEmail("requesterTest")
                                .teamId("teamIdTest")
                                .tableOrBreakoutRoom("tableOrBreakoutRoomTest")
                                .requestTime(ldt1)
                                .explanation("explanation")
                                .solved(false)
                                .build();

                LocalDateTime ldt2 = LocalDateTime.parse("2022-03-11T00:00:00");

                HelpRequest helpRequest2 = HelpRequest.builder()
                                .requesterEmail("requesterTest")
                                .teamId("teamIdTest")
                                .tableOrBreakoutRoom("tableOrBreakoutRoomTest")
                                .requestTime(ldt2)
                                .explanation("explanation")
                                .solved(false)
                                .build();

                ArrayList<HelpRequest> expectedDates = new ArrayList<>();
                expectedDates.addAll(Arrays.asList(helpRequest1, helpRequest2));

                when(helpRequestRepository.findAll()).thenReturn(expectedDates);

                // act
                MvcResult response = mockMvc.perform(get("/api/helprequest/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(helpRequestRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedDates);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void an_user_can_post_a_new_helprequest() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

                HelpRequest helpRequest1 = HelpRequest.builder()
                                .requesterEmail("requesterTest")
                                .teamId("teamIdTest")
                                .tableOrBreakoutRoom("tableOrBreakoutRoomTest")
                                .requestTime(ldt1)
                                .explanation("explanation")
                                .solved(false)
                                .build();

                when(helpRequestRepository.save(eq(helpRequest1))).thenReturn(helpRequest1);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/helprequest/post")
                                .param("requesterEmail", "requesterTest")
                                .param("teamId", "teamIdTest")
                                .param("tableOrBreakoutRoom", "tableOrBreakoutRoomTest")
                                .param("requestTime", ldt1.toString()) // Convert LocalDateTime to String
                                .param("explanation", "explanation")
                                .param("solved", "false") // Convert boolean to String
                                .with(csrf())
                                ).andExpect(status().isOk()).andReturn();

                // assert
                verify(helpRequestRepository, times(1)).save(helpRequest1);
                String expectedJson = mapper.writeValueAsString(helpRequest1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_a_helprequest() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

                HelpRequest helpRequest1 = HelpRequest.builder()
                                .requesterEmail("requesterTest")
                                .teamId("teamIdTest")
                                .tableOrBreakoutRoom("tableOrBreakoutRoomTest")
                                .requestTime(ldt1)
                                .explanation("explanation")
                                .solved(false)
                                .build();

                when(helpRequestRepository.findById(eq(15L))).thenReturn(Optional.of(helpRequest1));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/helprequest?id=15")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(helpRequestRepository, times(1)).findById(15L);
                verify(helpRequestRepository, times(1)).delete(any());

                Map<String, Object> json = responseToJson(response);
                assertEquals("HelpRequest with id 15 deleted", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existant_helprequest_and_gets_right_error_message()
                        throws Exception {
                // arrange

                when(helpRequestRepository.findById(eq(15L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/helprequest?id=15")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(helpRequestRepository, times(1)).findById(15L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("HelpRequest with id 15 not found", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_helprequest() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
                LocalDateTime ldt2 = LocalDateTime.parse("2023-01-03T00:00:00");

                HelpRequest helpRequestOrig = HelpRequest.builder()
                                .requesterEmail("requesterTest")
                                .teamId("teamIdTest")
                                .tableOrBreakoutRoom("tableOrBreakoutRoomTest")
                                .requestTime(ldt1)
                                .explanation("explanation")
                                .solved(false)
                                .build();

                HelpRequest helpRequestEdited = HelpRequest.builder()
                                .requesterEmail("requesterTest")
                                .teamId("teamIdTest")
                                .tableOrBreakoutRoom("tableOrBreakoutRoomTest")
                                .requestTime(ldt2)
                                .explanation("explanation")
                                .solved(false)
                                .build();

                String requestBody = mapper.writeValueAsString(helpRequestEdited);

                when(helpRequestRepository.findById(eq(67L))).thenReturn(Optional.of(helpRequestOrig));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/helprequest?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(helpRequestRepository, times(1)).findById(67L);
                verify(helpRequestRepository, times(1)).save(helpRequestEdited); // should be saved with correct user
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_helprequest_that_does_not_exist() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

                HelpRequest ucsbEditedDate = HelpRequest.builder()
                                .requesterEmail("requesterTest")
                                .teamId("teamIdTest")
                                .tableOrBreakoutRoom("tableOrBreakoutRoomTest")
                                .requestTime(ldt1)
                                .explanation("explanation")
                                .solved(false)
                                .build();

                String requestBody = mapper.writeValueAsString(ucsbEditedDate);

                when(helpRequestRepository.findById(eq(67L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/helprequest?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(helpRequestRepository, times(1)).findById(67L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("HelpRequest with id 67 not found", json.get("message"));

        }

        @WithMockUser(roles = { "ADMIN" }) // Only admins can update
        @Test
        public void test_admin_can_update_helpRequest() throws Exception {
        // Arrange
        LocalDateTime ldt = LocalDateTime.parse("2022-01-03T00:00:00");
        HelpRequest existing = HelpRequest.builder()
                .requesterEmail("original@example.com")
                .teamId("team1")
                .tableOrBreakoutRoom("room1")
                .requestTime(ldt)
                .explanation("original explanation")
                .solved(false)
                .build();

        HelpRequest updated = HelpRequest.builder()
                .requesterEmail("updated@example.com")
                .teamId("team2")
                .tableOrBreakoutRoom("room2")
                .requestTime(ldt.plusDays(1))
                .explanation("updated explanation")
                .solved(true)
                .build();

        when(helpRequestRepository.findById(eq(7L))).thenReturn(Optional.of(existing));
        when(helpRequestRepository.save(any(HelpRequest.class))).thenReturn(updated);

        // Act
        String requestBody = mapper.writeValueAsString(updated);

        MvcResult response = mockMvc.perform(
                put("/api/helprequest?id=7")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andReturn();

        // Assert
        verify(helpRequestRepository, times(1)).findById(7L);
        verify(helpRequestRepository, times(1)).save(any(HelpRequest.class));
        String responseString = response.getResponse().getContentAsString();
        assertEquals(mapper.writeValueAsString(updated), responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_postHelpRequest_setsSolvedCorrectly() throws Exception {
        // Arrange
        LocalDateTime ldt = LocalDateTime.parse("2022-01-03T00:00:00");

        HelpRequest toSave = HelpRequest.builder()
                .requesterEmail("new@example.com")
                .teamId("teamX")
                .tableOrBreakoutRoom("roomX")
                .requestTime(ldt)
                .explanation("need help")
                .solved(true) // true for this test
                .build();

        when(helpRequestRepository.save(any(HelpRequest.class))).thenReturn(toSave);

        // Act: Call the endpoint
        mockMvc.perform(post("/api/helprequest/post")
                .param("requesterEmail", "new@example.com")
                .param("teamId", "teamX")
                .param("tableOrBreakoutRoom", "roomX")
                .param("requestTime", "2022-01-03T00:00:00")
                .param("explanation", "need help")
                .param("solved", "true")
                .with(csrf()))
                .andExpect(status().isOk());

        // Assert: Capture the argument passed to save
        ArgumentCaptor<HelpRequest> helpRequestCaptor = ArgumentCaptor.forClass(HelpRequest.class);
        verify(helpRequestRepository, times(1)).save(helpRequestCaptor.capture());
        HelpRequest saved = helpRequestCaptor.getValue();
        assertEquals(true, saved.getSolved(), "The 'solved' field should be set to true");
        }
}
