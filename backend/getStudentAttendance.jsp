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
        "SELECT attendance_date, course_code, status " +
        "FROM attendance " +
        "WHERE TRIM(roll_number)=TRIM(?) " +
        "ORDER BY attendance_date DESC, course_code ASC";

    ps = con.prepareStatement(sql);
    ps.setString(1, rollNumber.trim());
    rs = ps.executeQuery();

    out.print("{\"ok\":true,\"items\":[");
    boolean first = true;

    while (rs.next()) {
        if (!first) out.print(",");

        String date = rs.getString("attendance_date");
        String courseCode = rs.getString("course_code");
        String status = rs.getString("status");

        if (date == null) date = "";
        if (courseCode == null) courseCode = "";
        if (status == null) status = "";

        date = date.replace("\"", "\\\"");
        courseCode = courseCode.replace("\"", "\\\"");
        status = status.replace("\"", "\\\"");

        out.print("{"
            + "\"date\":\"" + date + "\","
            + "\"course_code\":\"" + courseCode + "\","
            + "\"status\":\"" + status + "\""
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