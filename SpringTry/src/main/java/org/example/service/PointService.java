package org.example.service;

import org.example.db.entity.PointEntity;
import org.example.db.repo.PointRepository;
import org.example.models.Point;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PointService {
    private final PointRepository repo;

    public PointService(PointRepository repo) {
        this.repo = repo;
    }

    @Transactional
    public Point create(double x, double y, int r) {
        boolean hit = isHit(x, y, r);
        var entity = new PointEntity(x, y, r, hit);
        repo.save(entity);
        return new Point(x, y, r, hit);
    }

    private boolean isHit(double x, double y, int r) {
        if (x >= 0 && y >= 0) {return x <= (double) r /2 && y <= r;}
        else if (x <= 0 && y >= 0) {return y - 2*x <= r;}
        else if (x <= 0 && y <= 0) {return y*y + x*x <= (double) (r * r) /4;}
        return false;
    }

    @Transactional(readOnly = true)
    public List<Point> getAllPoints() {
        return repo.findAll()
                .stream()
                .map(this::toModel)
                .toList();
    }

    private Point toModel(PointEntity e) {
        return new Point(e.getX(), e.getY(), e.getR(), e.isHit());
    }
}
