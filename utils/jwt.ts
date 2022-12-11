import { SignJWT, jwtVerify } from "jose";

export async function sign(id?: string): Promise<string> {
  const secret = process.env.JWT_SEC;
  const date = new Date();
  const exp = new Date(date.setDate(date.getDate() + 1)).getTime();

  return new SignJWT({ id })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(exp)
    .sign(new TextEncoder().encode(secret));
}

export async function verify(token: string, secret: string): Promise<any> {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
  // run some checks on the returned payload, perhaps you expect some specific values

  // if its all good, return it, or perhaps just return a boolean
  return payload;
}
