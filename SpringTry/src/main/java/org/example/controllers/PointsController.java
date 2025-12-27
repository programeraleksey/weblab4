package org.example.controllers;

import org.example.dto.PointsResponse;
import org.example.service.PointService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/get")
public class PointsController {
    private final PointService service;

    public PointsController(PointService service) {
        this.service = service;
    }

    @GetMapping("/points")
    public PointsResponse time() {
        return new PointsResponse(service.getAllPoints());
    }
}