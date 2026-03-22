<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>

<%
response.setContentType("application/json");
response.setCharacterEncoding("UTF-8");

try {
    String sql = "SELECT assignment_id, title, course_code, due_date, status, marks, description FROM assignments ORDER BY due_date";
    PreparedStatement ps = con.prepareStatement(sql);
    ResultSet rs = ps.executeQuery();

    out.print("{\"ok\":true,\"items\":[");
    boolean first = true;

    while (rs.next()) {
        if (!first) out.print(",");

        String title = rs.getString("title");
        String courseCode = rs.getString("course_code");
        String dueDate = rs.getString("due_date");
        String status = rs.getString("status");
        String description = rs.getString("description");

        if (title == null) title = "";
        if (courseCode == null) courseCode = "";
        if (dueDate == null) dueDate = "";
        if (status == null) status = "";
        if (description == null) description = "";

        title = title.replace("\"", "\\\"");
        courseCode = courseCode.replace("\"", "\\\"");
        dueDate = dueDate.replace("\"", "\\\"");
        status = status.replace("\"", "\\\"");
        description = description.replace("\"", "\\\"");

        out.print("{"
            + "\"assignment_id\":" + rs.getInt("assignment_id") + ","
            + "\"title\":\"" + title + "\","
            + "\"course\":\"" + courseCode + "\","
            + "\"due\":\"" + dueDate + "\","
            + "\"status\":\"" + status + "\","
            + "\"marks\":" + rs.getInt("marks") + ","
            + "\"description\":\"" + description + "\""
            + "}");

        first = false;
    }

    out.print("]}");

} catch (Exception e) {
    out.print("{\"ok\":false,\"message\":\"" + e.getMessage().replace("\"", "\\\"") + "\"}");
}
%>