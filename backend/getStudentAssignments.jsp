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
        "SELECT a.assignment_id, a.title, a.course_code, a.description, a.due_date, a.marks, a.status " +
        "FROM assignments a " +
        "JOIN student_courses sc ON a.course_code = sc.course_code " +
        "WHERE TRIM(sc.roll_number)=TRIM(?) " +
        "ORDER BY a.due_date ASC";

    ps = con.prepareStatement(sql);
    ps.setString(1, rollNumber.trim());
    rs = ps.executeQuery();

    out.print("{\"ok\":true,\"items\":[");
    boolean first = true;

    while (rs.next()) {
        if (!first) out.print(",");

        int id = rs.getInt("assignment_id");
        String title = rs.getString("title");
        String courseCode = rs.getString("course_code");
        String description = rs.getString("description");
        String dueDate = rs.getString("due_date");
        int marks = rs.getInt("marks");
        String status = rs.getString("status");

        if (title == null) title = "";
        if (courseCode == null) courseCode = "";
        if (description == null) description = "";
        if (dueDate == null) dueDate = "";
        if (status == null) status = "";

        title = title.replace("\"", "\\\"");
        courseCode = courseCode.replace("\"", "\\\"");
        description = description.replace("\"", "\\\"");
        dueDate = dueDate.replace("\"", "\\\"");
        status = status.replace("\"", "\\\"");

        out.print("{"
            + "\"id\":" + id + ","
            + "\"title\":\"" + title + "\","
            + "\"course\":\"" + courseCode + "\","
            + "\"description\":\"" + description + "\","
            + "\"due\":\"" + dueDate + "\","
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