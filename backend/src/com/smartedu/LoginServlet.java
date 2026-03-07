package com.smartedu;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;

public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        resp.setContentType("application/xml");
        resp.setCharacterEncoding("UTF-8");

        String email = req.getParameter("email");
        String password = req.getParameter("password");

        boolean ok = "student@gmail.com".equalsIgnoreCase(email) && "1234".equals(password);

        PrintWriter out = resp.getWriter();
        out.println("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
        out.println("<loginResponse>");

        if (!ok) {
            out.println("  <status>fail</status>");
            out.println("  <message>Invalid email or password</message>");
        } else {
            out.println("  <status>success</status>");
            out.println("  <student>");
            out.println("    <name>John Doe</name>");
            out.println("    <roll>AU23CS001</roll>");
            out.println("    <course>B.Tech CSE</course>");
            out.println("    <email>" + escapeXml(email) + "</email>");
            out.println("  </student>");
        }

        out.println("</loginResponse>");
        out.flush();
    }

    private static String escapeXml(String s) {
        if (s == null) return "";
        return s.replace("&","&amp;")
                .replace("<","&lt;")
                .replace(">","&gt;")
                .replace("\"","&quot;")
                .replace("'","&apos;");
    }
}