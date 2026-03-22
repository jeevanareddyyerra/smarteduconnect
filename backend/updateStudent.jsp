<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>
<%
response.setContentType("application/json");
response.setCharacterEncoding("UTF-8");

if (!"POST".equalsIgnoreCase(request.getMethod())) {
    out.print("{\"ok\":false,\"message\":\"POST method required\"}");
    return;
}

String roll = request.getParameter("roll_number");
String name = request.getParameter("name");
String department = request.getParameter("department");
String yearStr = request.getParameter("year");
String email = request.getParameter("email");

if (roll == null || name == null || department == null || yearStr == null ||
    roll.trim().isEmpty() || name.trim().isEmpty() || department.trim().isEmpty() || yearStr.trim().isEmpty()) {
    out.print("{\"ok\":false,\"message\":\"Missing required fields\"}");
    return;
}

try {
    int year = Integer.parseInt(yearStr);

    String sql = "UPDATE students SET name=?, department=?, year=?, email=? WHERE roll_number=?";
    PreparedStatement ps = con.prepareStatement(sql);
    ps.setString(1, name);
    ps.setString(2, department);
    ps.setInt(3, year);
    ps.setString(4, email);
    ps.setString(5, roll);

    int rows = ps.executeUpdate();

    if (rows > 0) {
        out.print("{\"ok\":true,\"message\":\"Student updated successfully\"}");
    } else {
        out.print("{\"ok\":false,\"message\":\"Student not found\"}");
    }

} catch (Exception e) {
    out.print("{\"ok\":false,\"message\":\"" + e.getMessage().replace("\"", "\\\"") + "\"}");
} finally {
    try { if (con != null) con.close(); } catch (Exception e) {}
}
%>