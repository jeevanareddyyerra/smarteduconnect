<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>

<%
response.setContentType("application/json");
response.setCharacterEncoding("UTF-8");

String facultyId = request.getParameter("faculty_id");
String courseCode = request.getParameter("course_code");

PreparedStatement ps = null;

try {
    if (facultyId == null || courseCode == null ||
        facultyId.trim().isEmpty() || courseCode.trim().isEmpty()) {
        out.print("{\"ok\":false,\"message\":\"faculty_id and course_code are required\"}");
        return;
    }

    String sql = "INSERT IGNORE INTO faculty_courses (faculty_id, course_code) VALUES (?, ?)";
    ps = con.prepareStatement(sql);
    ps.setString(1, facultyId.trim());
    ps.setString(2, courseCode.trim());

    ps.executeUpdate();
    out.print("{\"ok\":true,\"message\":\"Course assigned to faculty successfully\"}");

} catch (Exception e) {
    out.print("{\"ok\":false,\"message\":\"" + e.getMessage().replace("\"","\\\"") + "\"}");
} finally {
    try { if (ps != null) ps.close(); } catch (Exception e) {}
    try { if (con != null) con.close(); } catch (Exception e) {}
}
%>