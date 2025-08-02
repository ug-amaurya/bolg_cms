import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email || !email.includes("@")) {
    return Response.json({ error: "Valid email required" }, { status: 400 });
  }

  try {
    // Check if already subscribed
    const existing = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existing) {
      return Response.json({ error: "Already subscribed" }, { status: 400 });
    }

    // Add to newsletter list
    await prisma.newsletter.create({
      data: { email },
    });

    // Send welcome email (if Resend is configured)
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "newsletter@yourblog.com",
        to: email,
        subject: "Welcome to our newsletter!",
        html: `
          <h1>Welcome to our newsletter!</h1>
          <p>Thank you for subscribing. You'll receive our latest posts and updates.</p>
        `,
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return Response.json({ error: "Subscription failed" }, { status: 500 });
  }
}
