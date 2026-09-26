import assert from 'node:assert/strict';
import {chooseLanguage} from '../dist/locale-policy.js';
import worker from '../dist/_worker.js';
for(const country of ['IT','SM','VA'])assert.equal(chooseLanguage({country,browserLanguage:'en-US'}),'it');
assert.equal(chooseLanguage({country:'US',browserLanguage:'it-IT'}),'en');
assert.equal(chooseLanguage({country:null,browserLanguage:'it-IT'}),'it');
assert.equal(chooseLanguage({country:'XX',browserLanguage:'en-GB'}),'en');
assert.equal(chooseLanguage({saved:'en',country:'IT',browserLanguage:'it'}),'en');
assert.equal(chooseLanguage({saved:'it',country:'US',browserLanguage:'en'}),'it');
assert.equal(chooseLanguage({saved:'bad',country:'IT'}),'it');
for(const country of ['IT','US',undefined,'XX','invalid']) {
  const request={url:'https://example.com/api/locale',method:'GET',cf:{country}};
  const response=await worker.fetch(request,{});
  assert.equal(response.headers.get('Cache-Control'),'private, no-store');
  assert.deepEqual(await response.json(),{country:['IT','US'].includes(country)?country:null});
}
assert.equal((await worker.fetch({url:'https://example.com/api/locale',method:'POST'},{})).status,405);
let forwarded=false;
const request=new Request('https://example.com/assets/map-logo.png');
const response=await worker.fetch(request,{ASSETS:{fetch(req){assert.equal(req,request);forwarded=true;return new Response('asset');}}});
assert.equal(await response.text(),'asset');assert(forwarded);
console.log('Validated IP-country selection, browser fallback, saved preference priority, uncached endpoint and static asset forwarding.');
