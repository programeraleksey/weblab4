package org.example.controllers;

import org.example.dto.*;
import org.example.models.Point;
import org.example.service.PointService;
import org.springframework.web.bind.annotation.*;

@RestController
public class CheckController {
    private final PointService service;

    public CheckController(PointService service) {
        this.service = service;
    }

    @PostMapping("/check")
    public CheckResponse check(@RequestBody CheckRequest req) {
        double x = req.x();
        double y = req.y();
        int r = req.r();
        Point point = service.create(x, y, r);
        return new CheckResponse(point.x(), point.y(), point.r(), point.hit());
    }
}