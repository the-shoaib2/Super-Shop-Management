package com.server.controller.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping("/ping")
    public Map<String, Object> ping() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "active");
        response.put("service", "SUPERSHOP SERVICE IS RUNNING...✨");
        response.put("database", isDatabaseConnected());
        return response;
    }

    private boolean isDatabaseConnected() {
        try {
            mongoTemplate.getDb().getName();
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
 