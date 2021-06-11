package org.FileTransfertV5.ServiceFile;


import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.encryption.AccessPermission;
import org.apache.pdfbox.pdmodel.encryption.StandardProtectionPolicy;
import org.glassfish.jersey.media.multipart.ContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static java.util.Collections.singletonMap;

@Path("/upload")
@Produces(MediaType.APPLICATION_JSON)
public class DownUploadResource {

	private String uploadDir;

	public DownUploadResource(String uploadDir) {
		this.uploadDir = uploadDir;
	}

	@GET
	public Response getUploadedFilesInfo() throws IOException {
		final List<FileInfo> files = new ArrayList<>();

		Files.walkFileTree(Paths.get(getUploadDir()), new SimpleFileVisitor<java.nio.file.Path>() {
			@Override
			public FileVisitResult visitFile(java.nio.file.Path path, BasicFileAttributes attrs) throws IOException {
				File file = path.toFile();
				LocalDateTime dt = LocalDateTime.ofInstant(attrs.creationTime().toInstant(), ZoneId.of("UTC"));
				files.add(new FileInfo(file.getName(), attrs.size(), dt.toLocalDate()));
				return FileVisitResult.CONTINUE;
			}
		});

		return Response.ok(Collections.singletonMap("files", files)).build();
	}

	@Path("/up")
	@POST
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response unauthenticatedUpload(@FormDataParam("fileData") FormDataContentDisposition contentDisposition,
			@FormDataParam("fileData") InputStream inputStream) {

		return handleUpload(contentDisposition, inputStream);
	}

	private Response handleUpload(ContentDisposition contentDisposition, InputStream inputStream) {
		String fileName = contentDisposition.getFileName();
		String finalName = UUID.randomUUID().toString().concat(fileName);
		try {
			PDDocument pdd = PDDocument.load(inputStream);
			AccessPermission ap = new AccessPermission();
			StandardProtectionPolicy stpp = new StandardProtectionPolicy("fred", "test001", ap);
			stpp.setEncryptionKeyLength(128);
			stpp.setPermissions(ap);
			pdd.protect(stpp);
			pdd.save(Paths.get(getUploadDir(), finalName).toString());
			pdd.close();

			return Response.ok(singletonMap("message", "File Uploaded Successfully")).build();
		} catch (Exception e) {
			return Response.serverError().build();
		}
	}



	public DownUploadResource() {
		
		// TODO Auto-generated constructor stub
	}

	public String getUploadDir() {
		return uploadDir;
	}
}
