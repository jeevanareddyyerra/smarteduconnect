<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>

<%
response.setContentType("application/json");
response.setCharacterEncoding("UTF-8");

String title = request.getParameter("title");
String courseCode = request.getParameter("course_code");
String description = request.getParameter("description");
String dueDate = request.getParameter("due_date");
String marks = request.getParameter("marks");

PreparedStatement ps = null;

try {
    if (title == null || courseCode == null || description == null || dueDate == null || marks == null ||
        title.trim().isEmpty() || courseCode.trim().isEmpty() ||
        description.trim().isEmpty() || dueDate.trim().isEmpty() || marks.trim().isEmpty()) {

        out.print("{\"ok\":false,\"message\":\"Missing assignment fields\"}");
        return;
    }

    String sql =
        "INSERT INTO assignments (title, course_code, description, due_date, marks, status) " +
        "VALUES (?, ?, ?, ?, ?, 'Pending')";

    ps = con.prepareStatement(sql);
    ps.setString(1, title.trim());
    ps.setString(2, courseCode.trim());
    ps.setString(3, description.trim());
    ps.setString(4, dueDate.trim());
    ps.setInt(5, Integer.parseInt(marks.trim()));

    int rows = ps.executeUpdate();

    if (rows > 0) {
        out.print("{\"ok\":true,\"message\":\"Assignment created successfully\"}");
    } else {
        out.print("{\"ok\":false,\"message\":\"Failed to create assignment\"}");
    }

} catch (Exception e) {
    out.print("{\"ok\":false,\"message\":\"" + e.getMessage().replace("\"", "\\\"") + "\"}");
} finally {
    try { if (ps != null) ps.close(); } catch (Exception e) {}
    try { if (con != null) con.close(); } catch (Exception e) {}
}
%>