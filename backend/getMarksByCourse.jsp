<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>

<%
response.setContentType("application/json");
response.setCharacterEncoding("UTF-8");

String courseCode = request.getParameter("course_code");
String examType = request.getParameter("exam_type");

if (courseCode == null || courseCode.trim().isEmpty() || examType == null || examType.trim().isEmpty()) {
    out.print("{\"ok\":false,\"message\":\"course_code and exam_type are required\"}");
    return;
}

PreparedStatement ps = null;
ResultSet rs = null;

try {
    String sql =
        "SELECT roll_number, score " +
        "FROM marks " +
        "WHERE TRIM(course_code)=TRIM(?) AND TRIM(exam_type)=TRIM(?)";

    ps = con.prepareStatement(sql);
    ps.setString(1, courseCode.trim());
    ps.setString(2, examType.trim());
    rs = ps.executeQuery();

    out.print("{\"ok\":true,\"items\":[");
    boolean first = true;

    while (rs.next()) {
        if (!first) out.print(",");

        String roll = rs.getString("roll_number");
        int score = rs.getInt("score");

        if (roll == null) roll = "";
        roll = roll.replace("\"", "\\\"");

        out.print("{"
            + "\"roll_number\":\"" + roll + "\","
            + "\"score\":" + score
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