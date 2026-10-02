export function pageSpeedError(status:number,configured:boolean,reason=''){
  if(status===429||/quota|rateLimit|dailyLimit|RESOURCE_EXHAUSTED/i.test(reason))return configured?'Google PageSpeed quota or rate limit reached. Your API key is configured; retry later or review the project quota in Google Cloud.':'Google PageSpeed anonymous quota reached. Configure PAGESPEED_API_KEY in Hostinger and redeploy.';
  if(/API_KEY_INVALID/i.test(reason))return 'Google rejected the configured PageSpeed API key. Check its value in Hostinger.';
  if(/SERVICE_DISABLED|accessNotConfigured/i.test(reason))return 'Enable PageSpeed Insights API in the Google Cloud project that owns this key.';
  if(/API_KEY_HTTP_REFERRER_BLOCKED/i.test(reason))return 'The PageSpeed key has browser-referrer restrictions. This audit runs on the server; use compatible server restrictions.';
  if(/API_KEY_SERVICE_BLOCKED/i.test(reason))return 'The API key restrictions do not allow PageSpeed Insights API. Add it to the allowed APIs in Google Cloud.';
  if(status===403)return 'Google denied PageSpeed access. Check API activation and API key restrictions in the key’s Google Cloud project.';
  if(status===400)return 'Google rejected the PageSpeed request. Check the website URL and configured API key.';
  return 'Google PageSpeed did not return scores (HTTP '+status+'). Retry later.';
}
