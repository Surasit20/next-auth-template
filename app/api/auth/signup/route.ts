import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'
import { randomBytes } from 'crypto';
const bcrypt = require('bcrypt');

const prisma = new PrismaClient()

export async function POST(request:Request) {
  try {

    const emailVerifToken = generateEmailVerificationToken();
    const saltRounds = 10;
    const { email, password, name } = await request.json();
    const hashedPassword = await bcrypt.hashSync(password, saltRounds)

    const user = await prisma.user.create({
      data: {
        email:email,
        password: hashedPassword,
        name:name,
        emailVerifToken:emailVerifToken
      },
    });

    const url:string = `${process.env.NEXTAUTH_URL}/api/auth/verify?email=${email}&token=${emailVerifToken}`;
    await sendVerificationRequest(url,email);

    return Response.json({ message: 'User created successfully', user });
  } catch (error) {
    return Response.json({ error: error})
  }
}


const generateEmailVerificationToken = () => {
  return randomBytes(32).toString('hex')
}

async function sendVerificationRequest(url:string,email:string) {

let host= process.env.NEXTAUTH_URL || "";
const transport = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT) || 0,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

const result = await transport.sendMail({
  to: email,
  from: process.env.EMAIL_SERVER_USER,
  subject: `Sign in to ${host}`,
  text: text({ url, host }),
  html: html({ url, host }),
})
const failed = result.rejected.concat(result.pending).filter(Boolean)
if (failed.length) {
  throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
}
}

/**
* Email HTML body
* Insert invisible space into domains from being turned into a hyperlink by email
* clients like Outlook and Apple mail, as this is confusing because it seems
* like they are supposed to click on it to sign in.
*
* @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
*/
function html(params: { url: string, host: string }) {
const { url, host } = params;
const escapedHost = host.replace(/\./g, "&#8203;.")
const brandColor =  "#346df1"
const color = {
  background: "#f9f9f9",
  text: "#444",
  mainBackground: "#fff",
  buttonBackground: brandColor,
  buttonBorder: brandColor,
  buttonText: "#fff",
}

return `
<body style="background: ${color.background};">
<table width="100%" border="0" cellspacing="20" cellpadding="0"
  style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
  <tr>
    <td align="center"
      style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
      Sign in to <strong>${escapedHost}</strong>
    </td>
  </tr>
  <tr>
    <td align="center" style="padding: 20px 0;">
      <table border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
              target="_blank"
              style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Sign
              in</a></td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td align="center"
      style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
      If you did not request this email you can safely ignore it.
    </td>
  </tr>
</table>
</body>
`
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string, host: string }) {
return `Sign in to ${host}\n${url}\n\n`
}
