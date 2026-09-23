// Cloudflare Pages Function — 用作 Decap CMS 的 GitHub OAuth 登录中转
// 严格实现 Decap 的 NetlifyAuthenticator 握手协议（源自 decap-cms 源码）
// 需要在 Cloudflare Pages 后台设置两个环境变量：
//   GITHUB_CLIENT_ID     （GitHub OAuth App 的 Client ID）
//   GITHUB_CLIENT_SECRET （GitHub OAuth App 的 Client Secret）

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;
  const redirectUri = `${url.origin}/api/auth`;

  const code = url.searchParams.get('code');
  const oauthError = url.searchParams.get('error');

  // GitHub 返回了授权错误
  if (oauthError) {
    return handshakePage(url.origin, 'error', JSON.stringify({ error_description: oauthError }));
  }

  // 第 1 步：还没有授权码，把浏览器导向 GitHub 授权页
  if (!code) {
    const gh =
      'https://github.com/login/oauth/authorize' +
      '?client_id=' + encodeURIComponent(clientId) +
      '&redirect_uri=' + encodeURIComponent(redirectUri) +
      '&scope=repo';
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
    return handshakePage(url.origin, 'error', JSON.stringify(tokenData));
  }

  // 第 3 步：按 Decap 协议把令牌交还后台
  return handshakePage(url.origin, 'success', JSON.stringify({ token: accessToken, provider: 'github' }));
}

// 生成执行握手的小页面（跑在弹窗里）
function handshakePage(origin, kind, payload) {
  const html =
    '<!DOCTYPE html><html><body>' +
    '<script>' +
    'var origin = ' + JSON.stringify(origin) + ';' +
    'var msg = "authorization:github:' + kind + ':" + ' + JSON.stringify(payload) + ';' +
    'if (!window.opener) {' +
    'document.body.textContent = "Login OK. You can close this window.";' +
    '} else {' +
    'window.opener.postMessage("authorizing:github", origin);' +
    'window.addEventListener("message", function(e) {' +
    'if (e.data === "authorizing:github" && e.origin === origin) {' +
    'window.opener.postMessage(msg, origin);' +
    'window.close();' +
    '}' +
    '});' +
    '}' +
    '</' + 'script></body></html>';
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
