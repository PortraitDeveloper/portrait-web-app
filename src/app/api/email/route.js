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

    console.log("Email Parameters:", email, subject, text, user, pass);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: user,
        pass: pass,
      },
    });

    console.log("Transporter:", transporter);

    const mailOptions = {
      from: "noreply",
      to: email,
      subject: subject,
      text: text,
    };

    console.log("mailOptions:", mailOptions);

    const info = await transporter.sendMail(mailOptions);

    console.log("Info:", info);
    console.log("Email sent:", info.response);

    console.log(currentTimeStamp, "Status: 200, Email sent successfully");
    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
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
