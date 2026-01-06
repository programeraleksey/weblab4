package org.example.db.repo;

import org.example.db.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    boolean existsByLogin_Login(String login);
    Optional<UserEntity> findByLogin_Login(String login);

    boolean existsByGoogle_GoogleSub(String sub);
    Optional<UserEntity> findByGoogle_GoogleSub(String sub);
}