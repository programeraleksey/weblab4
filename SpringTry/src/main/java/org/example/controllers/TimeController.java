package org.example.controllers;

import org.example.dto.TimeResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/get")
public class TimeController {

    @GetMapping("/time")
    public TimeResponse time() {
        return new TimeResponse(java.time.OffsetDateTime.now());
    }
}