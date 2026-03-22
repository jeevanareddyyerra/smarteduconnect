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

try {
    String sql =
        "SELECT course_code, course_name, department, credits " +
        "FROM courses WHERE faculty_id=? ORDER BY course_code";

    PreparedStatement ps = con.prepareStatement(sql);
    ps.setInt(1, Integer.parseInt(facultyId));
    ResultSet rs = ps.executeQuery();

    out.print("{\"ok\":true,\"items\":[");
    boolean first = true;

    while (rs.next()) {
        if (!first) out.print(",");

        String code = rs.getString("course_code");
        String name = rs.getString("course_name");
        String dept = rs.getString("department");

        if (code == null) code = "";
        if (name == null) name = "";
        if (dept == null) dept = "";

        code = code.replace("\"", "\\\"");
        name = name.replace("\"", "\\\"");
        dept = dept.replace("\"", "\\\"");

        out.print("{"
            + "\"course_code\":\"" + code + "\","
            + "\"course_name\":\"" + name + "\","
            + "\"department\":\"" + dept + "\","
            + "\"credits\":" + rs.getInt("credits")
            + "}");

        first = false;
    }

    out.print("]}");

} catch (Exception e) {
    out.print("{\"ok\":false,\"message\":\"" + e.getMessage().replace("\"","\\\"") + "\"}");
}
%>