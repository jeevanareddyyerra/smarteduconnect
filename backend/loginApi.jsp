<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>

<%
response.setContentType("application/json");
response.setCharacterEncoding("UTF-8");

String username = request.getParameter("username");
String password = request.getParameter("password");
String role = request.getParameter("role");

PreparedStatement ps = null;
ResultSet rs = null;

try {

    if (username == null || password == null || role == null ||
        username.trim().isEmpty() || password.trim().isEmpty() || role.trim().isEmpty()) {
        out.print("{\"ok\":false,\"message\":\"Missing login fields\"}");
        return;
    }

    String sql = "SELECT * FROM users WHERE TRIM(username)=TRIM(?) AND TRIM(password)=TRIM(?) AND TRIM(role)=TRIM(?)";
    ps = con.prepareStatement(sql);

    ps.setString(1, username.trim());
    ps.setString(2, password.trim());
    ps.setString(3, role.trim());

    rs = ps.executeQuery();

    if (rs.next()) {

        String linkedId = rs.getString("linked_id");
        String displayName = rs.getString("display_name");
        String dbRole = rs.getString("role");

        if (linkedId == null) linkedId = "";
        if (displayName == null) displayName = "";
        if (dbRole == null) dbRole = "";

        linkedId = linkedId.replace("\"", "\\\"");
        displayName = displayName.replace("\"", "\\\"");
        dbRole = dbRole.replace("\"", "\\\"");

        out.print("{"
                + "\"ok\":true,"
                + "\"linked_id\":\"" + linkedId + "\","
                + "\"display_name\":\"" + displayName + "\","
                + "\"role\":\"" + dbRole + "\""
                + "}");

    } else {
        out.print("{\"ok\":false,\"message\":\"Invalid email or password\"}");
    }

} catch (Exception e) {
    out.print("{\"ok\":false,\"message\":\"" + e.getMessage().replace("\"", "\\\"") + "\"}");
} finally {
    try { if (rs != null) rs.close(); } catch (Exception e) {}
    try { if (ps != null) ps.close(); } catch (Exception e) {}
    try { if (con != null) con.close(); } catch (Exception e) {}
}
%>