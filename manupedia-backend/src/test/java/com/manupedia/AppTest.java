package com.manupedia;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class AppTest {

    @Test
    public void contextLoads() {
        // Test that the Spring context loads successfully
        assertTrue(true);
    }

    @Test
    public void testApp() {
        assertTrue(true);
    }
}
