<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>

<html>
<head>
    <title>Marks</title>
</head>
<body>
    <h2>Marks Management</h2>

    <form method="post">
        Student ID: <input type="number" name="student_id" required><br><br>
        Subject Name: <input type="text" name="subject_name" required><br><br>
        Exam Type: <input type="text" name="exam_type" required><br><br>
        Score: <input type="number" name="score" min="0" max="100" required><br><br>
        <input type="submit" value="Save Marks">
    </form>

<%
if ("POST".equalsIgnoreCase(request.getMethod())) {
    try {
        int studentId = Integer.parseInt(request.getParameter("student_id"));
        String subject = request.getParameter("subject_name");
        String examType = request.getParameter("exam_type");
        int score = Integer.parseInt(request.getParameter("score"));

        String insertSql = "INSERT INTO marks (student_id, subject_name, exam_type, score) VALUES (?, ?, ?, ?)";
        PreparedStatement ps = con.prepareStatement(insertSql);
        ps.setInt(1, studentId);
        ps.setString(2, subject);
        ps.setString(3, examType);
        ps.setInt(4, score);

        int rows = ps.executeUpdate();

        if (rows > 0) {
            out.println("<p style='color:green;'>Marks saved successfully!</p>");
        } else {
            out.println("<p style='color:red;'>Failed to save marks.</p>");
        }

    } catch (Exception e) {
        out.println("<p style='color:red;'>Error: " + e.getMessage() + "</p>");
    }
}
%>

    <h3>Marks Records</h3>

    <table border="1" cellpadding="10">
        <tr>
            <th>ID</th>
            <th>Student ID</th>
            <th>Subject</th>
            <th>Exam Type</th>
            <th>Score</th>
        </tr>

<%
try {
    String sql = "SELECT * FROM marks";
    Statement st = con.createStatement();
    ResultSet rs = st.executeQuery(sql);

    while (rs.next()) {
%>
        <tr>
            <td><%= rs.getInt("id") %></td>
            <td><%= rs.getInt("student_id") %></td>
            <td><%= rs.getString("subject_name") %></td>
            <td><%= rs.getString("exam_type") %></td>
            <td><%= rs.getInt("score") %></td>
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