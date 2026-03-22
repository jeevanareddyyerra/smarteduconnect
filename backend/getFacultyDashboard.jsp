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

PreparedStatement ps1 = null;
PreparedStatement ps2 = null;
PreparedStatement ps3 = null;
PreparedStatement ps4 = null;
ResultSet rs1 = null;
ResultSet rs2 = null;
ResultSet rs3 = null;
ResultSet rs4 = null;

try {
    int courseCount = 0;
    int studentCount = 0;
    int assignmentCount = 0;
    int marksCount = 0;

    String coursesJson = "[]";

    ps1 = con.prepareStatement(
        "SELECT COUNT(*) AS total_courses " +
        "FROM faculty_courses WHERE TRIM(faculty_id)=TRIM(?)"
    );
    ps1.setString(1, facultyId.trim());
    rs1 = ps1.executeQuery();
    if (rs1.next()) {
        courseCount = rs1.getInt("total_courses");
    }

    ps2 = con.prepareStatement(
        "SELECT COUNT(DISTINCT sc.roll_number) AS total_students " +
        "FROM faculty_courses fc " +
        "JOIN student_courses sc ON fc.course_code = sc.course_code " +
        "WHERE TRIM(fc.faculty_id)=TRIM(?)"
    );
    ps2.setString(1, facultyId.trim());
    rs2 = ps2.executeQuery();
    if (rs2.next()) {
        studentCount = rs2.getInt("total_students");
    }

    ps3 = con.prepareStatement(
        "SELECT COUNT(*) AS total_assignments " +
        "FROM assignments a " +
        "JOIN faculty_courses fc ON a.course_code = fc.course_code " +
        "WHERE TRIM(fc.faculty_id)=TRIM(?)"
    );
    ps3.setString(1, facultyId.trim());
    rs3 = ps3.executeQuery();
    if (rs3.next()) {
        assignmentCount = rs3.getInt("total_assignments");
    }

    ps4 = con.prepareStatement(
        "SELECT COUNT(*) AS total_marks " +
        "FROM marks m " +
        "JOIN faculty_courses fc ON m.course_code = fc.course_code " +
        "WHERE TRIM(fc.faculty_id)=TRIM(?)"
    );
    ps4.setString(1, facultyId.trim());
    rs4 = ps4.executeQuery();
    if (rs4.next()) {
        marksCount = rs4.getInt("total_marks");
    }

    PreparedStatement ps5 = null;
    ResultSet rs5 = null;

    try {
        ps5 = con.prepareStatement(
            "SELECT c.course_code, c.course_name, c.credits " +
            "FROM faculty_courses fc " +
            "JOIN courses c ON fc.course_code = c.course_code " +
            "WHERE TRIM(fc.faculty_id)=TRIM(?) " +
            "ORDER BY c.course_code ASC LIMIT 5"
        );
        ps5.setString(1, facultyId.trim());
        rs5 = ps5.executeQuery();

        StringBuilder sb = new StringBuilder();
        sb.append("[");

        boolean first = true;
        while (rs5.next()) {
            if (!first) sb.append(",");

            String code = rs5.getString("course_code");
            String name = rs5.getString("course_name");
            int credits = rs5.getInt("credits");

            if (code == null) code = "";
            if (name == null) name = "";

            code = code.replace("\"", "\\\"");
            name = name.replace("\"", "\\\"");

            sb.append("{")
              .append("\"course_code\":\"").append(code).append("\",")
              .append("\"course_name\":\"").append(name).append("\",")
              .append("\"credits\":").append(credits)
              .append("}");

            first = false;
        }

        sb.append("]");
        coursesJson = sb.toString();

    } finally {
        try { if (rs5 != null) rs5.close(); } catch (Exception e) {}
        try { if (ps5 != null) ps5.close(); } catch (Exception e) {}
    }

    out.print("{"
        + "\"ok\":true,"
        + "\"course_count\":" + courseCount + ","
        + "\"student_count\":" + studentCount + ","
        + "\"assignment_count\":" + assignmentCount + ","
        + "\"marks_count\":" + marksCount + ","
        + "\"courses\":" + coursesJson
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