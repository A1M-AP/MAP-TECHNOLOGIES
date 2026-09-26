// Cloudflare Pages advanced mode; no third-party geolocation service or IP storage.
export default {
  async fetch(request,env) {
    const url=new URL(request.url);
    if(url.pathname==='/api/locale') {
      if(request.method!=='GET')return new Response(null,{status:405,headers:{Allow:'GET'}});
      const value=request.cf?.country;
      const country=typeof value==='string'&&/^[A-Z]{2}$/.test(value)&&value!=='XX'?value:null;
      return Response.json({country},{headers:{'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
    }
    return env.ASSETS.fetch(request);
  }
};
