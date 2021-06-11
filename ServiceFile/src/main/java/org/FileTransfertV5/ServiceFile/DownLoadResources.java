package org.FileTransfertV5.ServiceFile;

import java.io.File;
import java.text.NumberFormat;
 
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
 
@Path("/download")
@Produces(MediaType.APPLICATION_JSON)
public class DownLoadResources {

	private String downloadDir;
	DownUploadResource downUploadResource = new DownUploadResource();   
	  
		public DownLoadResources(String downloadDir) {
			super();
			this.downloadDir = downloadDir;
		}


	  @GET
	  @Path("/down")
	  @Produces(MediaType.APPLICATION_OCTET_STREAM)
	  public Response downloadFilebyQuery(@QueryParam("filename") String fileName) {
	    return download(fileName);
	  }
	 
	  private Response download(String fileName) {     
	    String fileLocation = downUploadResource.getUploadDir()+"/downloads/" + fileName;
	    Response response = null;
	    NumberFormat myFormat = NumberFormat.getInstance();
	      myFormat.setGroupingUsed(true);
	     
	    
	    File file = new File(downUploadResource.getUploadDir()+"/downloads/" + fileName);
	    if (file.exists()) {
	      ResponseBuilder builder = Response.ok(file);
	      builder.header("Content-Disposition", "attachment; filename=" + file.getName());
	      response = builder.build();
	    } else {
	      response = Response.status(404).
	              entity("FILE NOT FOUND: " + fileLocation).
	              type("text/plain").
	              build();
	    }
	      
	    return response;
	  }
}
