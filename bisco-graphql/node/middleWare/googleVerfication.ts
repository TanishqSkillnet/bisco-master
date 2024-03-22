export async function googleVerification(ctx: Context, next: ()=> Promise<any>) {

  ctx.status = 200
  ctx.body = 'google-site-verification: google6cca199324f9eaca.html'
  ctx.set('Accept','text/plain')

  await next()
}
