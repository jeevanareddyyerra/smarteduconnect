<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>

<html>
<head>
    <title>Attendance</title>
</head>
<body>
    <h2>Attendance Management</h2>

    <form method="post">
        Student ID: <input type="number" name="student_id" required><br><br>
        Subject Name: <input type="text" name="subject_name" required><br><br>
        Date: <input type="date" name="attendance_date" required><br><br>
        Status:
        <select name="status">
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
        </select><br><br>
        <input type="submit" value="Save Attendance">
    </form>

<%
if ("POST".equalsIgnoreCase(request.getMethod())) {
    try {
        int studentId = Integer.parseInt(request.getParameter("student_id"));
        String subject = request.getParameter("subject_name");
        String attendanceDate = request.getParameter("attendance_date");
        String status = request.getParameter("status");

        String insertSql = "INSERT INTO attendance (student_id, subject_name, attendance_date, status) VALUES (?, ?, ?, ?)";
        PreparedStatement ps = con.prepareStatement(insertSql);
        ps.setInt(1, studentId);
        ps.setString(2, subject);
        ps.setString(3, attendanceDate);
        ps.setString(4, status);

        int rows = ps.executeUpdate();

        if (rows > 0) {
            out.println("<p style='color:green;'>Attendance saved successfully!</p>");
        } else {
            out.println("<p style='color:red;'>Failed to save attendance.</p>");
        }

    } catch (Exception e) {
        out.println("<p style='color:red;'>Error: " + e.getMessage() + "</p>");
    }
}
%>

    <h3>Attendance Records</h3>

    <table border="1" cellpadding="10">
        <tr>
            <th>ID</th>
            <th>Student ID</th>
            <th>Subject</th>
            <th>Date</th>
            <th>Status</th>
        </tr>

<%
try {
    String sql = "SELECT * FROM attendance";
    Statement st = con.createStatement();
    ResultSet rs = st.executeQuery(sql);

    while (rs.next()) {
%>
        <tr>
            <td><%= rs.getInt("id") %></td>
            <td><%= rs.getInt("student_id") %></td>
            <td><%= rs.getString("subject_name") %></td>
            <td><%= rs.getDate("attendance_date") %></td>
            <td><%= rs.getString("status") %></td>
        </tr>
<%
    }
} catch (Exception e) {
    out.println("<tr><td colspan='5' style='color:red;'>Error: " + e.getMessage() + "</td></tr>");
}
%>

    </table>
</body>
</html>