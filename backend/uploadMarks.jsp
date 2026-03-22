<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>

<%
response.setContentType("application/json");

String roll = request.getParameter("roll_number");
String course = request.getParameter("course_code");
String marks = request.getParameter("marks");

try {

String sql="INSERT INTO marks(roll_number,course_code,marks) VALUES(?,?,?)";

PreparedStatement ps=con.prepareStatement(sql);

ps.setString(1,roll);
ps.setString(2,course);
ps.setInt(3,Integer.parseInt(marks));

int rows=ps.executeUpdate();

if(rows>0){
out.print("{\"ok\":true}");
}else{
out.print("{\"ok\":false}");
}

}catch(Exception e){

out.print("{\"ok\":false,\"message\":\""+e.getMessage().replace("\"","\\\"")+"\"}");

}
%>