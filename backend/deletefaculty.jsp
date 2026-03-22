<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>

<%
response.setContentType("application/json");
response.setCharacterEncoding("UTF-8");

String facultyId = request.getParameter("faculty_id");

PreparedStatement psFaculty = null;
PreparedStatement psUser = null;

try {
    if (facultyId == null || facultyId.trim().isEmpty()) {
        out.print("{\"ok\":false,\"message\":\"faculty_id is required\"}");
        return;
    }

    con.setAutoCommit(false);

    String sqlFaculty = "DELETE FROM faculty WHERE faculty_id=?";
    psFaculty = con.prepareStatement(sqlFaculty);
    psFaculty.setInt(1, Integer.parseInt(facultyId));
    int facultyRows = psFaculty.executeUpdate();

    String sqlUser = "DELETE FROM users WHERE linked_id=? AND role='faculty'";
    psUser = con.prepareStatement(sqlUser);
    psUser.setString(1, facultyId);
    psUser.executeUpdate();

    con.commit();

    if (facultyRows > 0) {
        out.print("{\"ok\":true,\"message\":\"Faculty deleted\"}");
    } else {
        out.print("{\"ok\":false,\"message\":\"Faculty not found\"}");
    }

} catch (Exception e) {
    try { if (con != null) con.rollback(); } catch (Exception ex) {}
    out.print("{\"ok\":false,\"message\":\"" + e.getMessage().replace("\"", "\\\"") + "\"}");
} finally {
    try { if (psFaculty != null) psFaculty.close(); } catch (Exception e) {}
    try { if (psUser != null) psUser.close(); } catch (Exception e) {}
    try { if (con != null) con.setAutoCommit(true); } catch (Exception e) {}
    try { if (con != null) con.close(); } catch (Exception e) {}
}
%>