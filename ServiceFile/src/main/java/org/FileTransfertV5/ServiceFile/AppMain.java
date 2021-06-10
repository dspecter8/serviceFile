package org.FileTransfertV5.ServiceFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.github.toastshaman.dropwizard.auth.jwt.JWTAuthFilter;
import com.github.toastshaman.dropwizard.auth.jwt.JsonWebTokenParser;
import com.github.toastshaman.dropwizard.auth.jwt.JsonWebTokenVerifier;
import com.github.toastshaman.dropwizard.auth.jwt.hmac.HmacSHA256Verifier;
import com.github.toastshaman.dropwizard.auth.jwt.model.JsonWebToken;
import com.github.toastshaman.dropwizard.auth.jwt.parser.DefaultJsonWebTokenParser;
import com.google.common.base.Optional;
import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.auth.AuthDynamicFeature;
import io.dropwizard.auth.AuthValueFactoryProvider;
import io.dropwizard.auth.AuthenticationException;
import io.dropwizard.auth.Authenticator;
import io.dropwizard.forms.MultiPartBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;

import java.nio.file.Paths;
import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class AppMain extends Application<DownUploadConfiguration> {
    final int KEY_LENGTH = 8;

    public static void main(String... args) throws Exception {
        new AppMain().run(args);
    }

    @Override
    public void initialize(Bootstrap<DownUploadConfiguration> bootstrap) {

    	ObjectMapper mapper = bootstrap.getObjectMapper();

        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        mapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);

        mapper.findAndRegisterModules();

        bootstrap.addBundle(new AssetsBundle("/webapp", "/", "index.html"));

        bootstrap.addBundle(new MultiPartBundle());
    }

   

    @Override
    public void run(DownUploadConfiguration downUploadConfiguration, Environment environment) throws Exception {
        environment.jersey().register(MultiPartFeature.class);
        environment.jersey().register(RolesAllowedDynamicFeature.class);
        environment.jersey().register(new DownUploadResource(downUploadConfiguration.getUploadsDir()));

    }
}
