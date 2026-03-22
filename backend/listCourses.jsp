<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>

<%
response.setContentType("application/json");

try {

    String sql = "SELECT * FROM courses ORDER BY course_code";

    Statement st = con.createStatement();
    ResultSet rs = st.executeQuery(sql);

    out.print("{\"ok\":true,\"items\":[");

    boolean first=true;

    while(rs.next()){

        if(!first) out.print(",");

        out.print("{"
        + "\"course_code\":\""+rs.getString("course_code")+"\","
        + "\"course_name\":\""+rs.getString("course_name")+"\","
        + "\"department\":\""+rs.getString("department")+"\","
        + "\"credits\":"+rs.getInt("credits")+","
        + "\"faculty_id\":"+rs.getInt("faculty_id")
        + "}");

        first=false;
    }

    out.print("]}");

}catch(Exception e){

    out.print("{\"ok\":false,\"message\":\""+e.getMessage().replace("\"","\\\"")+"\"}");

}
%>