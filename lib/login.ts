export interface LoginInput {email:string;password:string}
export function validateLogin({email,password}:LoginInput):Record<string,string> {
 const errors:Record<string,string>={};
 email=email.trim();
 if(!email)errors.email='Email is required';
 else if(email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))errors.email='Please enter a valid email address';
 if(!password)errors.password='Password is required';
 else if(password.length<6)errors.password='Use at least 6 characters for this demonstration';
 else if(password.length>128)errors.password='Use no more than 128 characters';
 return errors;
}
export function matchesDemo(input:LoginInput):boolean {
 return input.email.trim().toLowerCase()==='demo@business.com' && input.password==='password123';
}
export async function simulateLogin(input:LoginInput, delay:()=>Promise<void>=()=>new Promise(resolve=>setTimeout(resolve,800))):Promise<boolean> {
 if(Object.keys(validateLogin(input)).length)throw new Error('Invalid demonstration input');
 await delay();return matchesDemo(input);
}
