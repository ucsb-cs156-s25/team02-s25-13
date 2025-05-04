package edu.ucsb.cs156.example.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "helprequest")
public class HelpRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "REQUESTER_EMAIL")
    private String requesterEmail;

    @Column(name = "TEAM_ID")
    private String teamId;

    @Column(name = "TABLE_OR_BREAKOUT_ROOM")
    private String tableOrBreakoutRoom;

    @Column(name = "REQUEST_TIME")
    private LocalDateTime requestTime;

    @Column(name = "EXPLANATION")
    private String explanation;

    @Column(name = "SOLVED")
    private boolean solved;
}