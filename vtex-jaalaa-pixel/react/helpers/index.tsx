export async function fetchProfile(): Promise<string> {
  const profile = await (await fetch(
    '/no-cache/profileSystem/getProfile'
  )).json()

  // if(email == undefined) {
  //   return ''
  // }

  return profile
}
