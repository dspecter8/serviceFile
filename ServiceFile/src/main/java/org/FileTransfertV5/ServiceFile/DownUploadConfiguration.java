package org.FileTransfertV5.ServiceFile;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.dropwizard.Configuration;

import javax.validation.constraints.NotNull;

public class DownUploadConfiguration extends Configuration {

    @NotNull
    @JsonProperty
    private String uploadsDir;

    public String getUploadsDir() {
        return uploadsDir;
    }
}
