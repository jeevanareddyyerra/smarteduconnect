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

PreparedStatement ps1 = null;
PreparedStatement ps2 = null;
PreparedStatement ps3 = null;
PreparedStatement ps4 = null;
ResultSet rs1 = null;
ResultSet rs2 = null;
ResultSet rs3 = null;
ResultSet rs4 = null;

try {
    int totalAttendance = 0;
    int presentCount = 0;
    int courseCount = 0;
    int assignmentCount = 0;
    int averageScore = 0;

    String recentCoursesJson = "";

    ps1 = con.prepareStatement(
        "SELECT COUNT(*) AS total, " +
        "SUM(CASE WHEN status='Present' THEN 1 ELSE 0 END) AS present_count " +
        "FROM attendance WHERE TRIM(roll_number)=TRIM(?)"
    );
    ps1.setString(1, rollNumber.trim());
    rs1 = ps1.executeQuery();
    if (rs1.next()) {
        totalAttendance = rs1.getInt("total");
        presentCount = rs1.getInt("present_count");
    }

    ps2 = con.prepareStatement(
        "SELECT COUNT(*) AS total_courses " +
        "FROM student_courses WHERE TRIM(roll_number)=TRIM(?)"
    );
    ps2.setString(1, rollNumber.trim());
    rs2 = ps2.executeQuery();
    if (rs2.next()) {
        courseCount = rs2.getInt("total_courses");
    }

    ps3 = con.prepareStatement(
        "SELECT COUNT(*) AS total_assignments " +
        "FROM assignments a " +
        "JOIN student_courses sc ON a.course_code = sc.course_code " +
        "WHERE TRIM(sc.roll_number)=TRIM(?)"
    );
    ps3.setString(1, rollNumber.trim());
    rs3 = ps3.executeQuery();
    if (rs3.next()) {
        assignmentCount = rs3.getInt("total_assignments");
    }

    ps4 = con.prepareStatement(
        "SELECT ROUND(AVG(score)) AS avg_score " +
        "FROM marks WHERE TRIM(roll_number)=TRIM(?)"
    );
    ps4.setString(1, rollNumber.trim());
    rs4 = ps4.executeQuery();
    if (rs4.next()) {
        averageScore = rs4.getInt("avg_score");
    }

    PreparedStatement ps5 = null;
    ResultSet rs5 = null;

    try {
        ps5 = con.prepareStatement(
            "SELECT c.course_code, c.course_name, c.faculty_id " +
            "FROM student_courses sc " +
            "JOIN courses c ON sc.course_code = c.course_code " +
            "WHERE TRIM(sc.roll_number)=TRIM(?) " +
            "ORDER BY c.course_code ASC LIMIT 5"
        );
        ps5.setString(1, rollNumber.trim());
        rs5 = ps5.executeQuery();

        StringBuilder sb = new StringBuilder();
        sb.append("[");

        boolean first = true;
        while (rs5.next()) {
            if (!first) sb.append(",");

            String courseCode = rs5.getString("course_code");
            String courseName = rs5.getString("course_name");
            String facultyId = rs5.getString("faculty_id");

            if (courseCode == null) courseCode = "";
            if (courseName == null) courseName = "";
            if (facultyId == null) facultyId = "";

            courseCode = courseCode.replace("\"", "\\\"");
            courseName = courseName.replace("\"", "\\\"");
            facultyId = facultyId.replace("\"", "\\\"");

            sb.append("{")
              .append("\"course_code\":\"").append(courseCode).append("\",")
              .append("\"course_name\":\"").append(courseName).append("\",")
              .append("\"faculty_id\":\"").append(facultyId).append("\"")
              .append("}");

            first = false;
        }

        sb.append("]");
        recentCoursesJson = sb.toString();

    } finally {
        try { if (rs5 != null) rs5.close(); } catch (Exception e) {}
        try { if (ps5 != null) ps5.close(); } catch (Exception e) {}
    }

    int attendancePercent = totalAttendance == 0 ? 0 : (presentCount * 100 / totalAttendance);

    out.print("{"
        + "\"ok\":true,"
        + "\"attendance_total\":" + totalAttendance + ","
        + "\"attendance_present\":" + presentCount + ","
        + "\"attendance_percent\":" + attendancePercent + ","
        + "\"course_count\":" + courseCount + ","
        + "\"assignment_count\":" + assignmentCount + ","
        + "\"average_score\":" + averageScore + ","
        + "\"recent_courses\":" + recentCoursesJson
        + "}");

} catch (Exception e) {
    out.print("{\"ok\":false,\"message\":\"" + e.getMessage().replace("\"", "\\\"") + "\"}");
} finally {
    try { if (rs1 != null) rs1.close(); } catch (Exception e) {}
    try { if (rs2 != null) rs2.close(); } catch (Exception e) {}
    try { if (rs3 != null) rs3.close(); } catch (Exception e) {}
    try { if (rs4 != null) rs4.close(); } catch (Exception e) {}
    try { if (ps1 != null) ps1.close(); } catch (Exception e) {}
    try { if (ps2 != null) ps2.close(); } catch (Exception e) {}
    try { if (ps3 != null) ps3.close(); } catch (Exception e) {}
    try { if (ps4 != null) ps4.close(); } catch (Exception e) {}
    try { if (con != null) con.close(); } catch (Exception e) {}
}
%>