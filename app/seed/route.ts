import { db } from "@/db/index";
import { usersTable } from "@/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

async function seedAdmin() {
  try {
    const email = "admin@example.com";
    const plainPassword = "adminpassword";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existing.length > 0) {
      console.log("email already exists");
      return;
    }

    await db.insert(usersTable).values({
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin user created with email:", email);
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
  }
}

export async function GET() {
  try {
    await seedAdmin();
    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("❌ Error seeding:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}