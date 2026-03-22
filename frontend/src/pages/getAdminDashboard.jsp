<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>

<%
response.setContentType("application/json");
response.setCharacterEncoding("UTF-8");

Statement st1 = null;
Statement st2 = null;
Statement st3 = null;
Statement st4 = null;
ResultSet rs1 = null;
ResultSet rs2 = null;
ResultSet rs3 = null;
ResultSet rs4 = null;

try {
    int studentCount = 0;
    int facultyCount = 0;
    int courseCount = 0;
    int reportCount = 4;

    st1 = con.createStatement();
    rs1 = st1.executeQuery("SELECT COUNT(*) AS total FROM students");
    if (rs1.next()) studentCount = rs1.getInt("total");

    st2 = con.createStatement();
    rs2 = st2.executeQuery("SELECT COUNT(*) AS total FROM faculty");
    if (rs2.next()) facultyCount = rs2.getInt("total");

    st3 = con.createStatement();
    rs3 = st3.executeQuery("SELECT COUNT(*) AS total FROM courses");
    if (rs3.next()) courseCount = rs3.getInt("total");

    st4 = con.createStatement();
    rs4 = st4.executeQuery(
        "SELECT " +
        "(SELECT COUNT(*) FROM students) AS students_count, " +
        "(SELECT COUNT(*) FROM faculty) AS faculty_count, " +
        "(SELECT COUNT(*) FROM courses) AS courses_count, " +
        "(SELECT COUNT(*) FROM assignments) AS assignments_count, " +
        "(SELECT COUNT(*) FROM attendance) AS attendance_count, " +
        "(SELECT IFNULL(ROUND(AVG(score)),0) FROM marks) AS avg_marks"
    );

    int assignmentsCount = 0;
    int attendanceCount = 0;
    int avgMarks = 0;

    if (rs4.next()) {
        assignmentsCount = rs4.getInt("assignments_count");
        attendanceCount = rs4.getInt("attendance_count");
        avgMarks = rs4.getInt("avg_marks");
    }

    out.print("{"
        + "\"ok\":true,"
        + "\"students\":" + studentCount + ","
        + "\"faculty\":" + facultyCount + ","
        + "\"courses\":" + courseCount + ","
        + "\"reports\":" + reportCount + ","
        + "\"assignments\":" + assignmentsCount + ","
        + "\"attendance\":" + attendanceCount + ","
        + "\"avg_marks\":" + avgMarks
        + "}");

} catch (Exception e) {
    out.print("{\"ok\":false,\"message\":\"" + e.getMessage().replace("\"","\\\"") + "\"}");
} finally {
    try { if (rs1 != null) rs1.close(); } catch (Exception e) {}
    try { if (rs2 != null) rs2.close(); } catch (Exception e) {}
    try { if (rs3 != null) rs3.close(); } catch (Exception e) {}
    try { if (rs4 != null) rs4.close(); } catch (Exception e) {}
    try { if (st1 != null) st1.close(); } catch (Exception e) {}
    try { if (st2 != null) st2.close(); } catch (Exception e) {}
    try { if (st3 != null) st3.close(); } catch (Exception e) {}
    try { if (st4 != null) st4.close(); } catch (Exception e) {}
    try { if (con != null) con.close(); } catch (Exception e) {}
}
%>