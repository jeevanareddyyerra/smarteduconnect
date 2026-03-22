<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>

<%
response.setContentType("application/json");

try {

    String sql = "SELECT * FROM faculty ORDER BY faculty_id";

    Statement st = con.createStatement();
    ResultSet rs = st.executeQuery(sql);

    out.print("{\"ok\":true,\"items\":[");

    boolean first = true;

    while(rs.next()){

        if(!first) out.print(",");

        out.print("{"
        + "\"faculty_id\":"+rs.getInt("faculty_id")+","
        + "\"name\":\""+rs.getString("name")+"\","
        + "\"department\":\""+rs.getString("department")+"\","
        + "\"email\":\""+rs.getString("email")+"\","
        + "\"designation\":\""+rs.getString("designation")+"\""
        + "}");

        first = false;
    }

    out.print("]}");

} catch(Exception e){

    out.print("{\"ok\":false,\"message\":\""+e.getMessage().replace("\"","\\\"")+"\"}");

}
%>