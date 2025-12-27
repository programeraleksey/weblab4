package org.example.db.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String login;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    protected UserEntity() {}

    public UserEntity(String login, String passwordHash) {
        this.login = login;
        this.passwordHash = passwordHash;
    }

    public Long getId() { return id; }
    public String getLogin() { return login; }
    public String getPasswordHash() { return passwordHash; }
}
