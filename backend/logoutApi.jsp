<%
response.setContentType("application/json");
response.setCharacterEncoding("UTF-8");

session.invalidate();
out.print("{\"ok\":true}");
%>