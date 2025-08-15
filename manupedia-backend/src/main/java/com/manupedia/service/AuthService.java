package com.manupedia.service;

import com.manupedia.dto.AuthRequest;
import com.manupedia.dto.AuthResponse;
import com.manupedia.dto.SignupRequest;
import com.manupedia.entity.User;
import com.manupedia.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponse signup(SignupRequest signupRequest) {
        try {
            // Check if user already exists
            if (userService.existsByEmail(signupRequest.getEmail())) {
                throw new RuntimeException("Email already exists!");
            }

            // Create new user
            User user = new User();
            user.setName(signupRequest.getName());
            user.setEmail(signupRequest.getEmail());
            user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
            user.setRole(User.Role.USER);

            user = userService.save(user);

            String token = jwtUtil.generateToken(user);

            return new AuthResponse(
                    token,
                    user.getId(),
                    user.getEmail(),
                    user.getName(),
                    user.getRole().toString()
            );
        } catch (Exception e) {
            throw new RuntimeException("Signup failed: " + e.getMessage());
        }
    }

    public AuthResponse login(AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getEmail(),
                            authRequest.getPassword()
                    )
            );

            User user = (User) authentication.getPrincipal();
            String token = jwtUtil.generateToken(user);

            return new AuthResponse(
                    token,
                    user.getId(),
                    user.getEmail(),
                    user.getName(),
                    user.getRole().toString()
            );
        } catch (AuthenticationException e) {
            throw new RuntimeException("Invalid email or password");
        }
    }
}
