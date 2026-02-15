import { prisma } from "../lib/prisma.ts";

export const createRefreshToken = async (
  refreshToken: string,
  userId: string,
) => {
  const token = await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return token;
};

export const findRefreshToken = async (hashedRefreshToken: string) => {
  const stored = await prisma.refreshToken.findUnique({
    where: {
      token: hashedRefreshToken,
    },
  });

  return stored;
};

export const deleteRefreshToken = async (refershToken: string) => {
  await prisma.refreshToken.delete({
    where: {
      token: refershToken,
    },
  });
};
