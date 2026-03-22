<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>
<%
response.setContentType("application/json");
response.setCharacterEncoding("UTF-8");

PreparedStatement psFaculty = null;
PreparedStatement psUser = null;

try {
    String faculty_id = request.getParameter("faculty_id");
    String name = request.getParameter("name");
    String department = request.getParameter("department");
    String email = request.getParameter("email");
    String designation = request.getParameter("designation");

    if (faculty_id == null || name == null || department == null || email == null || designation == null ||
        faculty_id.trim().isEmpty() || name.trim().isEmpty() || department.trim().isEmpty() ||
        email.trim().isEmpty() || designation.trim().isEmpty()) {
        out.print("{\"ok\":false,\"message\":\"All fields are required\"}");
        return;
    }

    con.setAutoCommit(false);

    String sqlFaculty = "INSERT INTO faculty (faculty_id, name, department, email, designation) VALUES (?, ?, ?, ?, ?)";
    psFaculty = con.prepareStatement(sqlFaculty);
    psFaculty.setInt(1, Integer.parseInt(faculty_id.trim()));
    psFaculty.setString(2, name.trim());
    psFaculty.setString(3, department.trim());
    psFaculty.setString(4, email.trim());
    psFaculty.setString(5, designation.trim());
    psFaculty.executeUpdate();

    String sqlUser = "INSERT INTO users (username, password, role, linked_id, display_name) VALUES (?, ?, ?, ?, ?)";
    psUser = con.prepareStatement(sqlUser);
    psUser.setString(1, email.trim());
    psUser.setString(2, "fac123");
    psUser.setString(3, "faculty");
    psUser.setString(4, faculty_id.trim());
    psUser.setString(5, name.trim());
    psUser.executeUpdate();

    con.commit();

    out.print("{\"ok\":true,\"message\":\"Faculty added successfully\",\"default_password\":\"fac123\"}");

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