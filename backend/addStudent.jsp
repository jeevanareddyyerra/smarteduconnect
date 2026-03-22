<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>
<%
response.setContentType("application/json");
response.setCharacterEncoding("UTF-8");

PreparedStatement psStudent = null;
PreparedStatement psUser = null;

try {
    String roll = request.getParameter("roll_number");
    String name = request.getParameter("name");
    String department = request.getParameter("department");
    String yearStr = request.getParameter("year");
    String email = request.getParameter("email");

    if (roll == null || name == null || department == null || yearStr == null || email == null ||
        roll.trim().isEmpty() || name.trim().isEmpty() || department.trim().isEmpty() ||
        yearStr.trim().isEmpty() || email.trim().isEmpty()) {
        out.print("{\"ok\":false,\"message\":\"All fields are required\"}");
        return;
    }

    int year = Integer.parseInt(yearStr);

    con.setAutoCommit(false);

    String sqlStudent = "INSERT INTO students (roll_number, name, department, year, email) VALUES (?, ?, ?, ?, ?)";
    psStudent = con.prepareStatement(sqlStudent);
    psStudent.setString(1, roll.trim());
    psStudent.setString(2, name.trim());
    psStudent.setString(3, department.trim());
    psStudent.setInt(4, year);
    psStudent.setString(5, email.trim());
    psStudent.executeUpdate();

    String sqlUser = "INSERT INTO users (username, password, role, linked_id, display_name) VALUES (?, ?, ?, ?, ?)";
    psUser = con.prepareStatement(sqlUser);
    psUser.setString(1, email.trim());
    psUser.setString(2, "stud123");
    psUser.setString(3, "student");
    psUser.setString(4, roll.trim());
    psUser.setString(5, name.trim());
    psUser.executeUpdate();

    con.commit();

    out.print("{\"ok\":true,\"message\":\"Student added successfully\",\"default_password\":\"stud123\"}");

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