<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>

<%
response.setContentType("application/json");
response.setCharacterEncoding("UTF-8");

String rollNumber = request.getParameter("roll_number");
String courseCode = request.getParameter("course_code");
String examType = request.getParameter("exam_type");
String scoreStr = request.getParameter("score");

PreparedStatement checkPs = null;
PreparedStatement insertPs = null;
PreparedStatement updatePs = null;
ResultSet rs = null;

try {
    if (rollNumber == null || courseCode == null || examType == null || scoreStr == null ||
        rollNumber.trim().isEmpty() || courseCode.trim().isEmpty() ||
        examType.trim().isEmpty() || scoreStr.trim().isEmpty()) {

        out.print("{\"ok\":false,\"message\":\"Missing marks fields\"}");
        return;
    }

    int score = Integer.parseInt(scoreStr.trim());

    String checkSql =
        "SELECT mark_id FROM marks " +
        "WHERE TRIM(roll_number)=TRIM(?) AND TRIM(course_code)=TRIM(?) AND TRIM(exam_type)=TRIM(?)";

    checkPs = con.prepareStatement(checkSql);
    checkPs.setString(1, rollNumber.trim());
    checkPs.setString(2, courseCode.trim());
    checkPs.setString(3, examType.trim());
    rs = checkPs.executeQuery();

    if (rs.next()) {
        int markId = rs.getInt("mark_id");

        String updateSql = "UPDATE marks SET score=? WHERE mark_id=?";
        updatePs = con.prepareStatement(updateSql);
        updatePs.setInt(1, score);
        updatePs.setInt(2, markId);

        int rows = updatePs.executeUpdate();

        if (rows > 0) {
            out.print("{\"ok\":true,\"message\":\"Marks updated successfully\"}");
        } else {
            out.print("{\"ok\":false,\"message\":\"Failed to update marks\"}");
        }
    } else {
        String insertSql =
            "INSERT INTO marks (roll_number, course_code, exam_type, score) " +
            "VALUES (?, ?, ?, ?)";

        insertPs = con.prepareStatement(insertSql);
        insertPs.setString(1, rollNumber.trim());
        insertPs.setString(2, courseCode.trim());
        insertPs.setString(3, examType.trim());
        insertPs.setInt(4, score);

        int rows = insertPs.executeUpdate();

        if (rows > 0) {
            out.print("{\"ok\":true,\"message\":\"Marks saved successfully\"}");
        } else {
            out.print("{\"ok\":false,\"message\":\"Failed to save marks\"}");
        }
    }

} catch (Exception e) {
    out.print("{\"ok\":false,\"message\":\"" + e.getMessage().replace("\"", "\\\"") + "\"}");
} finally {
    try { if (rs != null) rs.close(); } catch (Exception e) {}
    try { if (checkPs != null) checkPs.close(); } catch (Exception e) {}
    try { if (insertPs != null) insertPs.close(); } catch (Exception e) {}
    try { if (updatePs != null) updatePs.close(); } catch (Exception e) {}
    try { if (con != null) con.close(); } catch (Exception e) {}
}
%>