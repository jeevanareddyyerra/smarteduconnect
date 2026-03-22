<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>

<%
response.setContentType("application/json");
response.setCharacterEncoding("UTF-8");

String courseCode = request.getParameter("course_code");
String courseName = request.getParameter("course_name");
String department = request.getParameter("department");
String credits = request.getParameter("credits");
String facultyId = request.getParameter("faculty_id");

PreparedStatement ps = null;

try {
    if (courseCode == null || courseName == null || department == null || credits == null || facultyId == null ||
        courseCode.trim().isEmpty() || courseName.trim().isEmpty() ||
        department.trim().isEmpty() || credits.trim().isEmpty() || facultyId.trim().isEmpty()) {
        out.print("{\"ok\":false,\"message\":\"Missing course fields\"}");
        return;
    }

    String sql = "INSERT INTO courses (course_code, course_name, department, credits, faculty_id) VALUES (?, ?, ?, ?, ?)";
    ps = con.prepareStatement(sql);
    ps.setString(1, courseCode.trim());
    ps.setString(2, courseName.trim());
    ps.setString(3, department.trim());
    ps.setInt(4, Integer.parseInt(credits.trim()));
    ps.setString(5, facultyId.trim());

    int rows = ps.executeUpdate();

    if (rows > 0) {
        out.print("{\"ok\":true,\"message\":\"Course added successfully\"}");
    } else {
        out.print("{\"ok\":false,\"message\":\"Failed to add course\"}");
    }

} catch (Exception e) {
    out.print("{\"ok\":false,\"message\":\"" + e.getMessage().replace("\"","\\\"") + "\"}");
} finally {
    try { if (ps != null) ps.close(); } catch (Exception e) {}
    try { if (con != null) con.close(); } catch (Exception e) {}
}
%>