// Cloudflare Pages Function — 用作 Decap CMS 的 GitHub OAuth 登录中转
// 作用：让用户用 GitHub 账号登录后台，并把令牌交还给 Decap。
// 需要在 Cloudflare Pages 后台设置两个环境变量：
//   GITHUB_CLIENT_ID     （GitHub OAuth App 的 Client ID）
//   GITHUB_CLIENT_SECRET （GitHub OAuth App 的 Client Secret）

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;
  const redirectUri = `${url.origin}/api/auth`;

  const code = url.searchParams.get('code');
  // 令牌必须送回 /admin/ 页面，Decap 才能接住它完成登录
  const state = url.searchParams.get('state') || `${url.origin}/admin/`;

  // 第 1 步：还没有授权码，把浏览器导向 GitHub 授权页
  if (!code) {
    const gh =
      `https://github.com/login/oauth/authorize` +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=repo` +
      `&state=${encodeURIComponent(state)}`;
    return Response.redirect(gh, 302);
  }

  // 第 2 步：用授权码向 GitHub 换取 access token
  const tokenResp = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: redirectUri }),
  });
  const tokenData = await tokenResp.json();
  const accessToken = tokenData.access_token;
  if (!accessToken) {
    return new Response('GitHub OAuth 失败：' + JSON.stringify(tokenData), { status: 400 });
  }

  // 第 3 步：把 token 通过 URL 交还给后台页面（Decap 会自动读取 ?token=）
  return Response.redirect(`${state}/?token=${accessToken}`, 302);
}
