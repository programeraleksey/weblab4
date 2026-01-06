package org.example.controllers;

import org.example.dto.TimeResponse;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Date;

@RestController
@RequestMapping("/get")
public class TimeController {

    @GetMapping("/time")
    public TimeResponse time() {
        return new TimeResponse(LocalDateTime.now());
    }
}