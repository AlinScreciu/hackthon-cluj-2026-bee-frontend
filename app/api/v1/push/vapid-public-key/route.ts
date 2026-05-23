export async function GET() {
  // Mock VAPID public key (not a real key, just valid base64url format)
  const key = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
  return Response.json({ key })
}
