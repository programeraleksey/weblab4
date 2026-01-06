package org.example.db.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "logins")
public class LoginEntity {

    @Id
    private Long userId; // PK = FK to users.id

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Column(nullable = false, unique = true)
    private String login;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    protected LoginEntity() {}

    public LoginEntity(String login, String passwordHash) {
        this.login = login;
        this.passwordHash = passwordHash;
    }

    Long getUserId() { return userId; }
    public UserEntity getUser() { return user; }

    void setUser(UserEntity user) { this.user = user; }

    public String getLogin() { return login; }
    public String getPasswordHash() { return passwordHash; }
}
