import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function PATCH(request: Request) {
  try {
    // const url = new URL(request.url);
    // const params = new URLSearchParams(url.searchParams);

    // const email = params.get("email");
    // const emailVerifToken = params.get("emailVerifToken");

    const { email, emailVerifToken } = await request.json();
    if (email != null && emailVerifToken != null) {
      const existingUser = await prisma.user.findUnique({
        where: { email: email, emailVerifToken: emailVerifToken },
      });

      if (existingUser == null) {
        return Response.json({
          error: "Email or Verify Token something went wrong.",
        });
      }

      if (existingUser.emailVerifToken == null) {
        return Response.json({
          message: "Email verified successfully. Please relogin.",
        });
      }

      
      await prisma.user.update({
        where: { email },
        data: {
          emailVerified: new Date(),
          emailVerifToken: null,
        
        },
      });
      return Response.json({ message: "Verify email  token successfully" });
    }
  } catch (error) {
    return Response.json({ error: error });
  }
}
