<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>

<%
response.setContentType("application/json");
response.setCharacterEncoding("UTF-8");

Statement st = null;
ResultSet rs = null;

try {
    st = con.createStatement();
    rs = st.executeQuery(
        "SELECT " +
        "(SELECT COUNT(*) FROM students) AS students_count, " +
        "(SELECT COUNT(*) FROM faculty) AS faculty_count, " +
        "(SELECT COUNT(*) FROM courses) AS courses_count, " +
        "(SELECT COUNT(*) FROM assignments) AS assignments_count, " +
        "(SELECT COUNT(*) FROM attendance) AS attendance_count, " +
        "(SELECT IFNULL(ROUND(AVG(score)),0) FROM marks) AS avg_marks"
    );

    int students = 0;
    int faculty = 0;
    int courses = 0;
    int assignments = 0;
    int attendance = 0;
    int avgMarks = 0;

    if (rs.next()) {
        students = rs.getInt("students_count");
        faculty = rs.getInt("faculty_count");
        courses = rs.getInt("courses_count");
        assignments = rs.getInt("assignments_count");
        attendance = rs.getInt("attendance_count");
        avgMarks = rs.getInt("avg_marks");
    }

    out.print("{"
        + "\"ok\":true,"
        + "\"students\":" + students + ","
        + "\"faculty\":" + faculty + ","
        + "\"courses\":" + courses + ","
        + "\"assignments\":" + assignments + ","
        + "\"attendance\":" + attendance + ","
        + "\"avg_marks\":" + avgMarks
        + "}");

} catch (Exception e) {
    out.print("{\"ok\":false,\"message\":\"" + e.getMessage().replace("\"","\\\"") + "\"}");
} finally {
    try { if (rs != null) rs.close(); } catch (Exception e) {}
    try { if (st != null) st.close(); } catch (Exception e) {}
    try { if (con != null) con.close(); } catch (Exception e) {}
}
%>