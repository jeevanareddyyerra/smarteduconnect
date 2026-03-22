<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>

<%
response.setContentType("application/json");

String code=request.getParameter("course_code");

try{

    String sql="DELETE FROM courses WHERE course_code=?";

    PreparedStatement ps=con.prepareStatement(sql);

    ps.setString(1,code);

    int rows=ps.executeUpdate();

    if(rows>0){
        out.print("{\"ok\":true,\"message\":\"Course deleted\"}");
    }else{
        out.print("{\"ok\":false,\"message\":\"Course not found\"}");
    }

}catch(Exception e){

    out.print("{\"ok\":false,\"message\":\""+e.getMessage().replace("\"","\\\"")+"\"}");

}
%>