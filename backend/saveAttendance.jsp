<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.io.BufferedReader" %>

<%
response.setContentType("application/json");
response.setCharacterEncoding("UTF-8");

try {
    StringBuilder sb = new StringBuilder();
    BufferedReader reader = request.getReader();
    String line;

    while ((line = reader.readLine()) != null) {
        sb.append(line);
    }

    String body = sb.toString();

    String courseCode = "";
    String attendanceDate = "";

    int courseIndex = body.indexOf("\"course_code\":\"");
    if (courseIndex != -1) {
        int start = courseIndex + 15;
        int end = body.indexOf("\"", start);
        courseCode = body.substring(start, end);
    }

    int dateIndex = body.indexOf("\"attendance_date\":\"");
    if (dateIndex != -1) {
        int start = dateIndex + 19;
        int end = body.indexOf("\"", start);
        attendanceDate = body.substring(start, end);
    }

    if (courseCode.isEmpty() || attendanceDate.isEmpty()) {
        out.print("{\"ok\":false,\"message\":\"Missing course code or date\"}");
        return;
    }

    String deleteSql = "DELETE FROM attendance WHERE course_code=? AND attendance_date=?";
    PreparedStatement deletePs = con.prepareStatement(deleteSql);
    deletePs.setString(1, courseCode);
    deletePs.setString(2, attendanceDate);
    deletePs.executeUpdate();

    String marker = "\"students\":[";
    int studentsIndex = body.indexOf(marker);

    if (studentsIndex == -1) {
        out.print("{\"ok\":false,\"message\":\"Students data missing\"}");
        return;
    }

    String studentsPart = body.substring(studentsIndex + marker.length());
    studentsPart = studentsPart.substring(0, studentsPart.lastIndexOf("]"));

    String[] studentEntries = studentsPart.split("\\},\\{");

    String insertSql = "INSERT INTO attendance (roll_number, course_code, attendance_date, status) VALUES (?, ?, ?, ?)";
    PreparedStatement insertPs = con.prepareStatement(insertSql);

    int inserted = 0;

    for (String entry : studentEntries) {
        entry = entry.replace("{", "").replace("}", "").replace("\"", "");

        String[] fields = entry.split(",");
        String rollNumber = "";
        String status = "";

        for (String field : fields) {
            String[] kv = field.split(":", 2);
            if (kv.length == 2) {
                String key = kv[0].trim();
                String value = kv[1].trim();

                if ("roll_number".equals(key)) {
                    rollNumber = value;
                } else if ("status".equals(key)) {
                    status = value;
                }
            }
        }

        if (!rollNumber.isEmpty() && !status.isEmpty()) {
            insertPs.setString(1, rollNumber);
            insertPs.setString(2, courseCode);
            insertPs.setString(3, attendanceDate);
            insertPs.setString(4, status);
            insertPs.addBatch();
            inserted++;
        }
    }

    insertPs.executeBatch();

    out.print("{\"ok\":true,\"message\":\"Attendance saved successfully\",\"count\":" + inserted + "}");

} catch (Exception e) {
    out.print("{\"ok\":false,\"message\":\"" + e.getMessage().replace("\"", "\\\"") + "\"}");
}
%>