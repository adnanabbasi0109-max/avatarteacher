/**
 * Database seed script
 * Run: pnpm db:seed
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create teacher
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@eduavatar.com" },
    update: {},
    create: {
      email: "teacher@eduavatar.com",
      name: "Demo Teacher",
      password: "hashed_password_here", // Use bcrypt in production
      role: "TEACHER",
    },
  });
  console.log(`Created teacher: ${teacher.name}`);

  // Create students
  const students = await Promise.all(
    [
      { email: "aarav@student.com", name: "Aarav Patel" },
      { email: "priya@student.com", name: "Priya Singh" },
      { email: "rahul@student.com", name: "Rahul Kumar" },
    ].map((s) =>
      prisma.user.upsert({
        where: { email: s.email },
        update: {},
        create: {
          ...s,
          password: "hashed_password_here",
          role: "STUDENT",
        },
      })
    )
  );
  console.log(`Created ${students.length} students`);

  // Create course
  const mathCourse = await prisma.course.create({
    data: {
      title: "Introduction to Mathematics",
      description:
        "A comprehensive introduction to algebra, geometry, and trigonometry for Grade 9 students.",
      subject: "Mathematics",
      gradeLevel: "Grade 9",
      teacherId: teacher.id,
      modules: {
        create: [
          {
            title: "Algebraic Expressions",
            description: "Learn the basics of algebraic expressions and equations",
            orderIndex: 1,
            learningObjectives: {
              create: [
                {
                  description: "Understand variables and constants in algebra",
                  bloomLevel: "UNDERSTAND",
                },
                {
                  description: "Simplify algebraic expressions",
                  bloomLevel: "APPLY",
                },
                {
                  description: "Solve linear equations in one variable",
                  bloomLevel: "APPLY",
                },
              ],
            },
            contentChunks: {
              create: [
                {
                  content:
                    "An algebraic expression is a mathematical phrase that contains numbers, variables, and operations. Variables are symbols (usually letters) that represent unknown values.",
                  contentType: "DEFINITION",
                  embedding: [],
                },
                {
                  content:
                    "Example: 3x + 5 is an algebraic expression where 3 is the coefficient, x is the variable, and 5 is the constant term.",
                  contentType: "EXAMPLE",
                  embedding: [],
                },
              ],
            },
          },
          {
            title: "Quadratic Equations",
            description: "Master quadratic equations and their solutions",
            orderIndex: 2,
            learningObjectives: {
              create: [
                {
                  description: "Identify quadratic equations",
                  bloomLevel: "REMEMBER",
                },
                {
                  description: "Solve quadratics using the quadratic formula",
                  bloomLevel: "APPLY",
                },
                {
                  description: "Analyze the discriminant to determine nature of roots",
                  bloomLevel: "ANALYZE",
                },
              ],
            },
          },
          {
            title: "Geometry Basics",
            description: "Fundamental concepts of geometry",
            orderIndex: 3,
            learningObjectives: {
              create: [
                {
                  description: "Calculate area and perimeter of basic shapes",
                  bloomLevel: "APPLY",
                },
                {
                  description: "Understand and apply the Pythagorean theorem",
                  bloomLevel: "APPLY",
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log(`Created course: ${mathCourse.title}`);

  // Create persona
  const persona = await prisma.persona.create({
    data: {
      name: "Prof. Ada",
      avatarModelUrl: "/avatars/default-tutor.glb",
      voiceId: "default",
      voiceProvider: "cartesia",
      personalityPrompt:
        "You are Prof. Ada, a warm and enthusiastic mathematics tutor. You love finding creative ways to explain math concepts and always encourage students to think critically. You use real-world examples and analogies to make abstract concepts concrete.",
      teachingStyle: "SOCRATIC",
      languageCode: "en",
      courseId: mathCourse.id,
      teacherId: teacher.id,
    },
  });
  console.log(`Created persona: ${persona.name}`);

  // Enroll students
  for (const student of students) {
    await prisma.enrollment.create({
      data: {
        studentId: student.id,
        courseId: mathCourse.id,
      },
    });
  }
  console.log(`Enrolled ${students.length} students`);

  console.log("\nSeeding complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
