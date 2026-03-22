<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>

<%
response.setContentType("application/json");

String facultyId = request.getParameter("faculty_id");
String name = request.getParameter("name");
String department = request.getParameter("department");
String email = request.getParameter("email");
String designation = request.getParameter("designation");

try {

    String sql = "UPDATE faculty SET name=?, department=?, email=?, designation=? WHERE faculty_id=?";

    PreparedStatement ps = con.prepareStatement(sql);

    ps.setString(1, name);
    ps.setString(2, department);
    ps.setString(3, email);
    ps.setString(4, designation);
    ps.setInt(5, Integer.parseInt(facultyId));

    int rows = ps.executeUpdate();

    if(rows > 0){
        out.print("{\"ok\":true,\"message\":\"Faculty updated\"}");
    } else {
        out.print("{\"ok\":false,\"message\":\"Faculty not found\"}");
    }

} catch(Exception e){

    out.print("{\"ok\":false,\"message\":\""+e.getMessage().replace("\"","\\\"")+"\"}");

}
%>