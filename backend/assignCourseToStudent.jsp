<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>

<%
response.setContentType("application/json");
response.setCharacterEncoding("UTF-8");

String rollNumber = request.getParameter("roll_number");
String courseCode = request.getParameter("course_code");

PreparedStatement ps = null;

try {
    if (rollNumber == null || courseCode == null ||
        rollNumber.trim().isEmpty() || courseCode.trim().isEmpty()) {
        out.print("{\"ok\":false,\"message\":\"roll_number and course_code are required\"}");
        return;
    }

    String sql = "INSERT IGNORE INTO student_courses (roll_number, course_code) VALUES (?, ?)";
    ps = con.prepareStatement(sql);
    ps.setString(1, rollNumber.trim());
    ps.setString(2, courseCode.trim());

    ps.executeUpdate();
    out.print("{\"ok\":true,\"message\":\"Course assigned to student successfully\"}");

} catch (Exception e) {
    out.print("{\"ok\":false,\"message\":\"" + e.getMessage().replace("\"","\\\"") + "\"}");
} finally {
    try { if (ps != null) ps.close(); } catch (Exception e) {}
    try { if (con != null) con.close(); } catch (Exception e) {}
}
%>