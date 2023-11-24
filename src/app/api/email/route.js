import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import getTimeStamp from "@/utils/getTimeStamp";

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

// Generate timestamp / current datetime
const currentTimeStamp = getTimeStamp(timeDiff);

// Create data
export async function POST(request) {
  try {
    // Read the body data
    const { email, subject, message } = await request.json();

    console.log("Email Parameters:", email, subject, message);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_HOST,
        pass: process.env.EMAIL_APP_PASS,
      },
    });

    const mailOptions = {
      from: "noreply",
      to: email,
      subject: subject,
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.response);

    console.log(currentTimeStamp, "Status: 200, Email sent successfully");
    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(
      currentTimeStamp,
      "api/email, Status: 500, An error occurred while processing the request"
    );
    return NextResponse.json(
      { error: "api/email, Status: 500, An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
