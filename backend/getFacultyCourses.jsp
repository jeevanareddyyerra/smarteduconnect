<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>

<%
response.setContentType("application/json");
response.setCharacterEncoding("UTF-8");

String facultyId = request.getParameter("faculty_id");

if (facultyId == null || facultyId.trim().isEmpty()) {
    out.print("{\"ok\":false,\"message\":\"faculty_id is required\"}");
    return;
}

PreparedStatement ps = null;
ResultSet rs = null;

try {
    String sql =
        "SELECT c.course_code, c.course_name, c.credits " +
        "FROM faculty_courses fc " +
        "JOIN courses c ON fc.course_code = c.course_code " +
        "WHERE TRIM(fc.faculty_id)=TRIM(?) " +
        "ORDER BY c.course_code";

    ps = con.prepareStatement(sql);
    ps.setString(1, facultyId.trim());
    rs = ps.executeQuery();

    out.print("{\"ok\":true,\"items\":[");
    boolean first = true;

    while (rs.next()) {
        if (!first) out.print(",");

        String courseCode = rs.getString("course_code");
        String courseName = rs.getString("course_name");
        int credits = rs.getInt("credits");

        if (courseCode == null) courseCode = "";
        if (courseName == null) courseName = "";

        courseCode = courseCode.replace("\"", "\\\"");
        courseName = courseName.replace("\"", "\\\"");

        out.print("{"
            + "\"course_code\":\"" + courseCode + "\","
            + "\"course_name\":\"" + courseName + "\","
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