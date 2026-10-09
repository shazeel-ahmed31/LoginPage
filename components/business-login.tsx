"use client"
import {useState,useRef,useEffect, type FormEvent} from 'react';
import {Building2,Eye,EyeOff,Loader2} from 'lucide-react';
import {validateLogin,simulateLogin} from '@/lib/login';
export default function BusinessLogin(){
 const [ready,setReady]=useState(false);
 const [email,setEmail]=useState('');const [password,setPassword]=useState('');
 const [visible,setVisible]=useState(false);const [loading,setLoading]=useState(false);
 const [errors,setErrors]=useState<Record<string,string>>({});const [status,setStatus]=useState<'idle'|'success'|'error'>('idle');
 const attempt=useRef(0);const busy=useRef(false);const form=useRef<HTMLFormElement>(null);
 useEffect(()=>{setReady(true);return ()=>{attempt.current++}},[]);
 async function submit(event:FormEvent){
  event.preventDefault();if(busy.current)return;
  setStatus('idle');const nextErrors=validateLogin({email,password});setErrors(nextErrors);
  if(Object.keys(nextErrors).length){form.current?.querySelector<HTMLInputElement>(`#${nextErrors.email?'email':'password'}`)?.focus();return;}
  const id=++attempt.current;busy.current=true;setLoading(true);
  try{const success=await simulateLogin({email,password});if(id===attempt.current)setStatus(success?'success':'error');}
  catch{if(id===attempt.current)setStatus('error');}
  finally{if(id===attempt.current){busy.current=false;setLoading(false);}}
 }
 function changed(field:'email'|'password',value:string){
  if(field==='email')setEmail(value);else setPassword(value);
  setErrors(previous=>({...previous,[field]:''}));setStatus('idle');
 }
 return <main className="login-page"><div className="login-shell">
  <header className="brand"><span className="brand-icon"><Building2 aria-hidden="true"/></span><h1>BusinessPro</h1><p>Fictional business login interface</p></header>
  <section className="login-card" aria-labelledby="loginTitle"><h2 id="loginTitle">Welcome back</h2><p className="intro">Try the frontend sign-in demonstration</p>
   <form ref={form} onSubmit={submit} noValidate aria-busy={loading}>
    <div aria-live="polite" aria-atomic="true">
     {status==='success'&&<p className="feedback success" role="status">Demo sign-in succeeded. No session was created and no dashboard is connected.</p>}
     {status==='error'&&<p className="feedback error" role="alert">The demo credentials did not match. Use the sample values below.</p>}
     {loading&&<p role="status">Simulating sign-in…</p>}
    </div>
    <label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="username" maxLength={254} value={email} disabled={loading} onChange={e=>changed('email',e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email?'emailError':undefined}/>
    {errors.email&&<p id="emailError" className="field-error">{errors.email}</p>}
    <label htmlFor="password">Password</label><div className="password-field"><input id="password" type={visible?'text':'password'} autoComplete="current-password" maxLength={128} value={password} disabled={loading} onChange={e=>changed('password',e.target.value)} aria-invalid={!!errors.password} aria-describedby={errors.password?'passwordError':undefined}/>
    <button className="visibility" type="button" aria-label={visible?'Hide password':'Show password'} aria-pressed={visible} disabled={loading} onClick={()=>setVisible(value=>!value)}>{visible?<EyeOff aria-hidden="true"/>:<Eye aria-hidden="true"/>}</button></div>
    {errors.password&&<p id="passwordError" className="field-error">{errors.password}</p>}
    <button className="submit" type="submit" disabled={loading || !ready}>{loading?<><Loader2 className="spinner" aria-hidden="true"/> Simulating…</>:'Try demo sign-in'}</button>
   </form>
   <p className="limitations">Account creation, password recovery, and remembered sessions are not implemented.</p>
  </section>
  <aside className="demo" aria-label="Demo credentials"><h2>Frontend demo only</h2><p>No credentials are sent to a server or stored. Use the sample values; avoid entering a real password.</p><p>Email: <code>demo@business.com</code><br/>Password: <code>password123</code></p>
  <button type="button" disabled={loading || !ready} onClick={()=>{setEmail('demo@business.com');setPassword('password123');setErrors({});setStatus('idle');}}>Fill demo credentials</button></aside>
  <noscript>This demonstration needs JavaScript; sign-in is disabled.</noscript><footer>BusinessPro is a fictional sample brand.</footer>
 </div></main>
}
