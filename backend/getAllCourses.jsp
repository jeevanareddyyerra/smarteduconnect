<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>

<%
response.setContentType("application/json");
response.setCharacterEncoding("UTF-8");

Statement st = null;
ResultSet rs = null;

try {
    st = con.createStatement();
    rs = st.executeQuery("SELECT course_code, course_name, department, credits, faculty_id FROM courses ORDER BY course_code");

    out.print("{\"ok\":true,\"items\":[");
    boolean first = true;

    while (rs.next()) {
        if (!first) out.print(",");

        String code = rs.getString("course_code");
        String name = rs.getString("course_name");
        String dept = rs.getString("department");
        int credits = rs.getInt("credits");
        String facultyId = rs.getString("faculty_id");

        if (code == null) code = "";
        if (name == null) name = "";
        if (dept == null) dept = "";
        if (facultyId == null) facultyId = "";

        code = code.replace("\"","\\\"");
        name = name.replace("\"","\\\"");
        dept = dept.replace("\"","\\\"");
        facultyId = facultyId.replace("\"","\\\"");

        out.print("{"
            + "\"course_code\":\"" + code + "\","
            + "\"course_name\":\"" + name + "\","
            + "\"department\":\"" + dept + "\","
            + "\"credits\":" + credits + ","
            + "\"faculty_id\":\"" + facultyId + "\""
            + "}");

        first = false;
    }

    out.print("]}");

} catch (Exception e) {
    out.print("{\"ok\":false,\"message\":\"" + e.getMessage().replace("\"","\\\"") + "\"}");
} finally {
    try { if (rs != null) rs.close(); } catch (Exception e) {}
    try { if (st != null) st.close(); } catch (Exception e) {}
    try { if (con != null) con.close(); } catch (Exception e) {}
}
%>