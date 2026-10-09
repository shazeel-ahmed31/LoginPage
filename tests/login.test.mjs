import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateLogin,matchesDemo,simulateLogin} from '../lib/login.ts';
test('required fields, trimmed email, syntax and demo password bounds',()=>{
 assert.deepEqual(Object.keys(validateLogin({email:' ',password:''})),['email','password']);
 for(const email of ['a@b','x a@b.c','a@b.c extra','a@@b.c'])assert.ok(validateLogin({email,password:'password123'}).email);
 assert.ok(validateLogin({email:'demo@business.com',password:'12345'}).password);
 assert.ok(validateLogin({email:'demo@business.com',password:'x'.repeat(129)}).password);
 assert.deepEqual(validateLogin({email:' demo@business.com ',password:'123456'}),{});
});
test('demo email is normalized but password stays exact',()=>{
 assert.equal(matchesDemo({email:' DEMO@business.com ',password:'password123'}),true);
 assert.equal(matchesDemo({email:'demo@business.com',password:'Password123'}),false);
 assert.equal(matchesDemo({email:'demo@business.com',password:' password123'}),false);
});
test('simulation waits, returns feedback and rejects invalid values before delay',async()=>{
 let finish;let settled=false;
 const pending=simulateLogin({email:'demo@business.com',password:'password123'},()=>new Promise(resolve=>finish=resolve)).then(value=>{settled=true;return value});
 assert.equal(settled,false);finish();assert.equal(await pending,true);
 assert.equal(await simulateLogin({email:'other@example.com',password:'wrong123'},async()=>{}),false);
 await assert.rejects(()=>simulateLogin({email:'',password:''},()=>assert.fail('invalid input delayed')),/Invalid/);
});
