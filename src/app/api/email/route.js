import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

// Generate timestamp / current datetime
const currentTimeStamp = getTimeStamp(timeDiff);

export async function POST(request) {
  try {
    // Read the body data
    const { email, subject, text } = await request.json();
    const user = process.env.EMAIL_HOST;
    const pass = process.env.EMAIL_APP_PASS;

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
      text: text,
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
