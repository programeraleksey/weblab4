package org.example.service;

import org.example.db.entity.LoginEntity;
import org.example.dto.RegisterResponse;
import org.example.db.entity.UserEntity;
import org.example.db.repo.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public RegisterResponse register(String login, String password) {
        if (login.isEmpty()) {
            throw new IllegalArgumentException("login is required");
        }
        if (password.isEmpty()) {
            throw new IllegalArgumentException("password is required");
        }

        if (userRepository.existsByLogin_Login(login)) {
            throw new IllegalArgumentException("login already taken");
        }

        String hash = passwordEncoder.encode(password);
        UserEntity user = new UserEntity();
        LoginEntity loginEntity = new LoginEntity(login, hash);
        user.attachLogin(loginEntity);
        UserEntity saved = userRepository.save(user);

        return new RegisterResponse(saved.getId(), saved.getLogin().getLogin());
    }
}
