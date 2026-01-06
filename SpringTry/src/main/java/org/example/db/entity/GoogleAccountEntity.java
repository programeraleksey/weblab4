package org.example.db.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "google")
public class GoogleAccountEntity {

    @Id
    private Long userId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Column(name = "google_sub", nullable = false, unique = true)
    private String googleSub;

    protected GoogleAccountEntity() {}

    public GoogleAccountEntity(String googleSub) {
        this.googleSub = googleSub;
    }

    Long getUserId() { return userId; }
    public UserEntity getUser() { return user; }
    void setUser(UserEntity user) { this.user = user; }

    public String getGoogleSub() { return googleSub; }
}
