package org.example.utils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.db.entity.GoogleAccountEntity;
import org.example.db.entity.UserEntity;
import org.example.db.repo.UserRepository;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;

@Component
public class GoogleOauth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final SecurityContextRepository securityContextRepository;

    public GoogleOauth2SuccessHandler(UserRepository userRepository,
                                      SecurityContextRepository securityContextRepository) {
        this.userRepository = userRepository;
        this.securityContextRepository = securityContextRepository;
    }

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OidcUser oidc = (OidcUser) authentication.getPrincipal();
        String sub = oidc.getClaimAsString("sub");

        String name = oidc.getFullName();
        if (name == null || name.isBlank()) name = "google";

        UserEntity user = userRepository.findByGoogle_GoogleSub(sub)
                .orElseGet(() -> {
                    UserEntity u = new UserEntity();
                    GoogleAccountEntity g = new GoogleAccountEntity(sub);
                    u.attachGoogle(g);
                    return userRepository.save(u);
                });

        UsernamePasswordAuthenticationToken appAuth =
                new UsernamePasswordAuthenticationToken(
                        new AppPrincipal(name),
                        null,
                        null
                );

        var ctx = SecurityContextHolder.createEmptyContext();
        ctx.setAuthentication(appAuth);
        SecurityContextHolder.setContext(ctx);
        securityContextRepository.saveContext(ctx, request, response);

        response.sendRedirect("/");
    }
}
