<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>

<%
response.setContentType("application/json");

String code = request.getParameter("course_code");
String name = request.getParameter("course_name");
String dept = request.getParameter("department");
String credits = request.getParameter("credits");
String faculty = request.getParameter("faculty_id");

try {

    String sql="UPDATE courses SET course_name=?, department=?, credits=?, faculty_id=? WHERE course_code=?";

    PreparedStatement ps=con.prepareStatement(sql);

    ps.setString(1,name);
    ps.setString(2,dept);
    ps.setInt(3,Integer.parseInt(credits));
    ps.setInt(4,Integer.parseInt(faculty));
    ps.setString(5,code);

    int rows=ps.executeUpdate();

    if(rows>0){
        out.print("{\"ok\":true,\"message\":\"Course updated\"}");
    }else{
        out.print("{\"ok\":false,\"message\":\"Course not found\"}");
    }

}catch(Exception e){

    out.print("{\"ok\":false,\"message\":\""+e.getMessage().replace("\"","\\\"")+"\"}");

}
%>