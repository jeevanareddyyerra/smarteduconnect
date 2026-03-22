<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>
<%
response.setContentType("application/json");
response.setCharacterEncoding("UTF-8");

String roll = request.getParameter("roll_number");

PreparedStatement psStudent = null;
PreparedStatement psUser = null;

if (roll == null || roll.trim().isEmpty()) {
    out.print("{\"ok\":false,\"message\":\"roll_number is required\"}");
    return;
}

try {
    con.setAutoCommit(false);

    String sqlStudent = "DELETE FROM students WHERE roll_number=?";
    psStudent = con.prepareStatement(sqlStudent);
    psStudent.setString(1, roll);
    int studentRows = psStudent.executeUpdate();

    String sqlUser = "DELETE FROM users WHERE linked_id=? AND role='student'";
    psUser = con.prepareStatement(sqlUser);
    psUser.setString(1, roll);
    psUser.executeUpdate();

    con.commit();

    if (studentRows > 0) {
        out.print("{\"ok\":true,\"message\":\"Student deleted successfully\"}");
    } else {
        out.print("{\"ok\":false,\"message\":\"Student not found\"}");
    }

} catch (Exception e) {
    try { if (con != null) con.rollback(); } catch (Exception ex) {}
    out.print("{\"ok\":false,\"message\":\"" + e.getMessage().replace("\"", "\\\"") + "\"}");
} finally {
    try { if (psStudent != null) psStudent.close(); } catch (Exception e) {}
    try { if (psUser != null) psUser.close(); } catch (Exception e) {}
    try { if (con != null) con.setAutoCommit(true); } catch (Exception e) {}
    try { if (con != null) con.close(); } catch (Exception e) {}
}
%>