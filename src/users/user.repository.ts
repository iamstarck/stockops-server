import { prisma } from "../lib/prisma.ts";

export const findUserByEmailWithPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user;
};
