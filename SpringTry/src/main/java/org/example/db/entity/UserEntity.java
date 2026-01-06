package org.example.db.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // optional 1:1, владелец связи на стороне дочерних таблиц (Login/Google)
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private LoginEntity login;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private GoogleAccountEntity google;

    public UserEntity() {}

    public Long getId() { return id; }

    public LoginEntity getLogin() { return login; }
    public GoogleAccountEntity getGoogle() { return google; }

    public void attachLogin(LoginEntity login) {
        this.login = login;
        if (login != null) login.setUser(this);
    }

    public void attachGoogle(GoogleAccountEntity google) {
        this.google = google;
        if (google != null) google.setUser(this);
    }
}
