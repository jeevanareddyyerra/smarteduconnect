<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>

<%
response.setContentType("application/json");
response.setCharacterEncoding("UTF-8");

String courseCode = request.getParameter("course_code");

if (courseCode == null || courseCode.trim().isEmpty()) {
    out.print("{\"ok\":false,\"message\":\"course_code is required\"}");
    return;
}

PreparedStatement ps = null;
ResultSet rs = null;

try {
    String sql =
        "SELECT s.roll_number, s.name " +
        "FROM student_courses sc " +
        "JOIN students s ON sc.roll_number = s.roll_number " +
        "WHERE TRIM(sc.course_code)=TRIM(?) " +
        "ORDER BY s.roll_number";

    ps = con.prepareStatement(sql);
    ps.setString(1, courseCode.trim());
    rs = ps.executeQuery();

    out.print("{\"ok\":true,\"items\":[");
    boolean first = true;

    while (rs.next()) {
        if (!first) out.print(",");

        String roll = rs.getString("roll_number");
        String name = rs.getString("name");

        if (roll == null) roll = "";
        if (name == null) name = "";

        roll = roll.replace("\"", "\\\"");
        name = name.replace("\"", "\\\"");

        out.print("{"
            + "\"roll_number\":\"" + roll + "\","
            + "\"name\":\"" + name + "\""
            + "}");

        first = false;
    }

    out.print("]}");

} catch (Exception e) {
    out.print("{\"ok\":false,\"message\":\"" + e.getMessage().replace("\"", "\\\"") + "\"}");
} finally {
    try { if (rs != null) rs.close(); } catch (Exception e) {}
    try { if (ps != null) ps.close(); } catch (Exception e) {}
    try { if (con != null) con.close(); } catch (Exception e) {}
}
%>