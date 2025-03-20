import bcrypt from "bcrypt"

export const hashPass = async(value: string, saltRounds?: number) =>
    bcrypt.hash(value, saltRounds || 10);

export const comparePass = async (value: string, hashedPass: string) =>
    bcrypt.compare(value, hashedPass).catch(() => false);