package edu.ucsb.cs156.example.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@Builder
@Entity(name = "helprequests")
@EntityListeners(AuditingEntityListener.class)
public class HelpRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private String requesterEmail;
    private String teamId;
    private String tableOrBreakoutRoom;
    private LocalDateTime requestTime;
    private String explanation;
    private boolean solved;
}