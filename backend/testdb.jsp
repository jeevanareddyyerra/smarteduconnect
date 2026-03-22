<%@ page import="java.sql.*" %>
<html>
<body>
<%
try {
    String url = "jdbc:mysql://localhost:3306/smarteduconnect?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    String username = "root";
    String password = "jeevana@0780";

    Connection con = DriverManager.getConnection(url, username, password);
    out.println("<h2 style='color:green;'>DB Connected Successfully</h2>");
} catch (Exception e) {
    out.println("<h2 style='color:red;'>Error Type: " + e.getClass().getName() + "</h2>");
    out.println("<h3 style='color:red;'>Error Details: " + e.toString() + "</h3>");
}
%>
</body>
</html>