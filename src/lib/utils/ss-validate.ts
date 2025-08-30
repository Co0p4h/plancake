import { ENV_RESERVED_USERNAMES } from "$env/static/private";

const DEFAULT_RESERVED = ['admin', 'api', 'root', 'system'];

function getReservedUsernames(): string[] {
  const envReserved = ENV_RESERVED_USERNAMES;
  
  if (!envReserved) {
    console.warn('RESERVED_USERNAMES not set, using defaults');
    return DEFAULT_RESERVED;
  }
  
  return envReserved.split(',').map(u => u.trim().toLowerCase());
}

function isReservedUsername(username: string): boolean {
	return getReservedUsernames().includes(username.toLowerCase());
}

export function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username) && 
		!isReservedUsername(username)
	);
}

export function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}

export function validateEmail(email: unknown): email is string {
	return (
		typeof email === 'string' && /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
	);
}
