import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Server-side validation schema
const contactSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s\-'.]+$/, "Name contains invalid characters"),
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  company: z.string()
    .trim()
    .max(100, "Company name must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  phone: z.string()
    .trim()
    .max(20, "Phone must be less than 20 characters")
    .regex(/^[\d\s\-+().]*$/, "Phone contains invalid characters")
    .optional()
    .or(z.literal("")),
  service: z.string()
    .trim()
    .max(50, "Service must be less than 50 characters")
    .optional()
    .or(z.literal("")),
  message: z.string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
  honeypot: z.string().optional(),
});

// Sanitize HTML to prevent XSS
function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

const handler = async (req: Request): Promise<Response> => {
  console.log("📧 Contact form submission received");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("📋 Request body received");

    // Honeypot check - if filled, it's a bot
    if (body.honeypot) {
      console.log("🤖 Bot detected via honeypot");
      return new Response(
        JSON.stringify({ error: "Invalid submission" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate input
    const validatedData = contactSchema.parse(body);
    console.log("✅ Data validated successfully");

    // Sanitize all inputs
    const sanitizedData = {
      name: sanitizeInput(validatedData.name),
      email: sanitizeInput(validatedData.email),
      company: validatedData.company ? sanitizeInput(validatedData.company) : "Not provided",
      phone: validatedData.phone ? sanitizeInput(validatedData.phone) : "Not provided",
      service: validatedData.service ? sanitizeInput(validatedData.service) : "Not specified",
      message: sanitizeInput(validatedData.message),
    };
    console.log("🧹 Data sanitized");

    // Send notification email to business
    const businessEmail = await resend.emails.send({
      from: "JDGK Contact Form <onboarding@resend.dev>",
      to: ["info@jdgkbsi.ph"],
      replyTo: validatedData.email,
      subject: `New Contact Form Submission from ${sanitizedData.name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .field { margin-bottom: 20px; }
              .label { font-weight: bold; color: #667eea; margin-bottom: 5px; }
              .value { background: white; padding: 10px; border-radius: 5px; border-left: 4px solid #667eea; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">📧 New Contact Form Submission</h1>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Name:</div>
                  <div class="value">${sanitizedData.name}</div>
                </div>
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value">${sanitizedData.email}</div>
                </div>
                <div class="field">
                  <div class="label">Company:</div>
                  <div class="value">${sanitizedData.company}</div>
                </div>
                <div class="field">
                  <div class="label">Phone:</div>
                  <div class="value">${sanitizedData.phone}</div>
                </div>
                <div class="field">
                  <div class="label">Service Interest:</div>
                  <div class="value">${sanitizedData.service}</div>
                </div>
                <div class="field">
                  <div class="label">Message:</div>
                  <div class="value">${sanitizedData.message}</div>
                </div>
                <div class="footer">
                  <p>This email was sent from your JDGK website contact form.</p>
                  <p>Reply directly to this email to respond to ${sanitizedData.name}</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (businessEmail.error) {
      console.error("❌ Error sending business email:", businessEmail.error);
      throw new Error(`Failed to send business notification: ${businessEmail.error.message}`);
    }
    console.log("✅ Business notification sent:", businessEmail.data?.id);

    // Send confirmation email to user
    const confirmationEmail = await resend.emails.send({
      from: "JDGK Business Solutions Inc. <onboarding@resend.dev>",
      to: [validatedData.email],
      subject: "We received your message!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Thank You, ${sanitizedData.name}! 🎉</h1>
              </div>
              <div class="content">
                <p>We have received your message and appreciate you reaching out to JDGK Business Solutions Inc.</p>
                <p>Our team will review your inquiry and get back to you as soon as possible, typically within 1-2 business days.</p>
                <p><strong>What you sent us:</strong></p>
                <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea; margin: 20px 0;">
                  ${sanitizedData.message}
                </div>
                <p>If you have any urgent concerns, feel free to call us directly at:</p>
                <p style="text-align: center; font-size: 18px; color: #667eea; font-weight: bold;">
                  📞 (02) 8637 6272
                </p>
                <div style="text-align: center;">
                  <a href="https://jdgkbsi.ph" class="button">Visit Our Website</a>
                </div>
                <div class="footer">
                  <p><strong>JDGK Business Solutions Inc.</strong></p>
                  <p>7th Floor Feliza Building, 108 V.A. Rufino St. corner Esteban St., Legaspi Village, Makati City, Philippines</p>
                  <p>Email: info@jdgkbsi.ph | Phone: (02) 8637 6272</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (confirmationEmail.error) {
      console.error("⚠️ Error sending confirmation email:", confirmationEmail.error);
      // Don't throw - business email sent successfully
    } else {
      console.log("✅ Confirmation email sent:", confirmationEmail.data?.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully",
        businessEmailId: businessEmail.data?.id,
        confirmationEmailId: confirmationEmail.data?.id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("❌ Error in send-contact-email function:", error);

    // Handle validation errors
    if (error.name === "ZodError") {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: error.errors.map((e: any) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Handle other errors
    return new Response(
      JSON.stringify({
        error: "Failed to send email",
        message: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
