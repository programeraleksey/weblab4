package org.example.db.repo;

import org.example.db.entity.PointEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PointRepository extends JpaRepository<PointEntity, Long> {}
