<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>

<%
response.setContentType("application/json");
response.setCharacterEncoding("UTF-8");

String rollNumber = request.getParameter("roll_number");

if (rollNumber == null || rollNumber.trim().isEmpty()) {
    out.print("{\"ok\":false,\"message\":\"roll_number is required\"}");
    return;
}

PreparedStatement ps = null;
ResultSet rs = null;

try {

    String sql =
        "SELECT c.course_code, c.course_name, c.credits, " +
        "f.name AS faculty_name " +
        "FROM student_courses sc " +
        "JOIN courses c ON sc.course_code = c.course_code " +
        "LEFT JOIN faculty f ON c.faculty_id = f.faculty_id " +
        "WHERE TRIM(sc.roll_number)=TRIM(?) " +
        "ORDER BY c.course_code";

    ps = con.prepareStatement(sql);
    ps.setString(1, rollNumber.trim());
    rs = ps.executeQuery();

    out.print("{\"ok\":true,\"items\":[");
    boolean first = true;

    while (rs.next()) {
        if (!first) out.print(",");

        String code = rs.getString("course_code");
        String name = rs.getString("course_name");
        String faculty = rs.getString("faculty_name");
        int credits = rs.getInt("credits");

        if (code == null) code = "";
        if (name == null) name = "";
        if (faculty == null) faculty = "";

        code = code.replace("\"", "\\\"");
        name = name.replace("\"", "\\\"");
        faculty = faculty.replace("\"", "\\\"");

        out.print("{"
            + "\"course_code\":\"" + code + "\","
            + "\"course_name\":\"" + name + "\","
            + "\"faculty\":\"" + faculty + "\","
            + "\"credits\":" + credits
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