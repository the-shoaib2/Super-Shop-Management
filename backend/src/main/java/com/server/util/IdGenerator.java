package com.server.util;

import java.util.Random;

public class IdGenerator {
    private static final Random random = new Random();
    
    public static String generateOwnerId() {
        return String.format("OWN%09d", Math.abs(random.nextInt(1000000000)));
    }
    
    public static String generateStoreId() {
        return String.format("STR%09d", Math.abs(random.nextInt(1000000000)));
    }
} 