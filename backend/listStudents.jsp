<%@ include file="db.jspf" %>
<%@ page import="java.sql.*" %>
<%
response.setContentType("application/json");
response.setCharacterEncoding("UTF-8");

try {
    String sql = "SELECT roll_number, name, department, year, email FROM students ORDER BY roll_number";
    PreparedStatement ps = con.prepareStatement(sql);
    ResultSet rs = ps.executeQuery();

    out.print("{\"ok\":true,\"items\":[");
    boolean first = true;

    while (rs.next()) {
        if (!first) out.print(",");

        String roll = rs.getString("roll_number");
        String name = rs.getString("name");
        String department = rs.getString("department");
        int year = rs.getInt("year");
        String email = rs.getString("email");

        if (roll == null) roll = "";
        if (name == null) name = "";
        if (department == null) department = "";
        if (email == null) email = "";

        roll = roll.replace("\"", "\\\"");
        name = name.replace("\"", "\\\"");
        department = department.replace("\"", "\\\"");
        email = email.replace("\"", "\\\"");

        out.print("{"
            + "\"roll_number\":\"" + roll + "\","
            + "\"name\":\"" + name + "\","
            + "\"department\":\"" + department + "\","
            + "\"year\":" + year + ","
            + "\"email\":\"" + email + "\""
            + "}");

        first = false;
    }

    out.print("]}");

} catch (Exception e) {
    out.print("{\"ok\":false,\"message\":\"" + e.getMessage().replace("\"", "\\\"") + "\"}");
} finally {
    try { if (con != null) con.close(); } catch (Exception e) {}
}
%>