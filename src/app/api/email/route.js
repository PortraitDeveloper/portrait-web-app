import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";
import Handlebars from "handlebars";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

export async function POST(request) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  const fileName = "emailTemplate.html";
  const filePath = path.join(process.cwd(), "public", fileName);

  try {
    // Read the body data
    const { email, subject } = await request.json();
    const user = process.env.EMAIL_HOST;
    const pass = process.env.EMAIL_APP_PASS;

    const source = (await fs.readFile(filePath, "utf8")).toString();
    const template = Handlebars.compile(source);
    const replacements = {
      subject: subject,
      email: email,
    };
    const html = template(replacements);

    // Transporter config
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: user,
        pass: pass,
      },
    });

    // Mail options config
    const mailOptions = {
      from: "The Portrait Place",
      to: email,
      subject: subject,
      html: html,
    };

    // Send email and get response
    const generateEmail = await transporter.sendMail(mailOptions);
    console.log("Email sent:", generateEmail.response);

    // Return success log and email response
    return NextResponse.json({
      created_at: currentTimeStamp,
      route: "/api/email",
      status: 200,
      message: generateEmail.response,
    });
  } catch (error) {
    // If the system or server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/email",
      status: 500,
      message: error,
    };
    errorLog(log);
    return NextResponse.json(log);
  }
}
