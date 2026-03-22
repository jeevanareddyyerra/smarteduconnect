<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>

<%
response.setContentType("application/json");
response.setCharacterEncoding("UTF-8");

String title = request.getParameter("title");
String courseCode = request.getParameter("course_code");
String dueDate = request.getParameter("due_date");
String marks = request.getParameter("marks");
String description = request.getParameter("description");
String facultyId = request.getParameter("faculty_id");

if (title == null || courseCode == null || dueDate == null || marks == null || facultyId == null ||
    title.trim().isEmpty() || courseCode.trim().isEmpty() || dueDate.trim().isEmpty() ||
    marks.trim().isEmpty() || facultyId.trim().isEmpty()) {
    out.print("{\"ok\":false,\"message\":\"Missing required fields\"}");
    return;
}

try {
    String sql = "INSERT INTO assignments (title, course_code, due_date, status, marks, description, faculty_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
    PreparedStatement ps = con.prepareStatement(sql);
    ps.setString(1, title);
    ps.setString(2, courseCode);
    ps.setString(3, dueDate);
    ps.setString(4, "Pending");
    ps.setInt(5, Integer.parseInt(marks));
    ps.setString(6, description);
    ps.setInt(7, Integer.parseInt(facultyId));

    int rows = ps.executeUpdate();

    if (rows > 0) {
        out.print("{\"ok\":true,\"message\":\"Assignment created successfully\"}");
    } else {
        out.print("{\"ok\":false,\"message\":\"Failed to create assignment\"}");
    }

} catch (Exception e) {
    out.print("{\"ok\":false,\"message\":\"" + e.getMessage().replace("\"","\\\"") + "\"}");
}
%>