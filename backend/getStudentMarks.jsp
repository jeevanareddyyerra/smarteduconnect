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
        "SELECT course_code, exam_type, score " +
        "FROM marks " +
        "WHERE TRIM(roll_number)=TRIM(?) " +
        "ORDER BY course_code ASC";

    ps = con.prepareStatement(sql);
    ps.setString(1, rollNumber.trim());
    rs = ps.executeQuery();

    out.print("{\"ok\":true,\"items\":[");
    boolean first = true;

    while (rs.next()) {
        if (!first) out.print(",");

        String course = rs.getString("course_code");
        String exam = rs.getString("exam_type");
        int score = rs.getInt("score");

        if (course == null) course = "";
        if (exam == null) exam = "";

        course = course.replace("\"", "\\\"");
        exam = exam.replace("\"", "\\\"");

        out.print("{"
            + "\"course_code\":\"" + course + "\","
            + "\"exam_type\":\"" + exam + "\","
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