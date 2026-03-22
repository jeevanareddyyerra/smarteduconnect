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
        "SELECT a.assignment_id, a.title, a.course_code, a.due_date, a.marks, a.status " +
        "FROM assignments a " +
        "JOIN faculty_courses fc ON a.course_code = fc.course_code " +
        "WHERE TRIM(fc.faculty_id)=TRIM(?) " +
        "ORDER BY a.due_date DESC";

    ps = con.prepareStatement(sql);
    ps.setString(1, facultyId.trim());
    rs = ps.executeQuery();

    out.print("{\"ok\":true,\"items\":[");
    boolean first = true;

    while (rs.next()) {
        if (!first) out.print(",");

        int id = rs.getInt("assignment_id");
        String title = rs.getString("title");
        String courseCode = rs.getString("course_code");
        String dueDate = rs.getString("due_date");
        int marks = rs.getInt("marks");
        String status = rs.getString("status");

        if (title == null) title = "";
        if (courseCode == null) courseCode = "";
        if (dueDate == null) dueDate = "";
        if (status == null) status = "";

        title = title.replace("\"", "\\\"");
        courseCode = courseCode.replace("\"", "\\\"");
        dueDate = dueDate.replace("\"", "\\\"");
        status = status.replace("\"", "\\\"");

        out.print("{"
            + "\"id\":" + id + ","
            + "\"title\":\"" + title + "\","
            + "\"course_code\":\"" + courseCode + "\","
            + "\"due_date\":\"" + dueDate + "\","
            + "\"marks\":" + marks + ","
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