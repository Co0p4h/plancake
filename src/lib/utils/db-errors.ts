import type { PostgresError } from 'postgres';

/**
 * converts database errors into user-friendly messages
 */
export function parseDbError(error: unknown): { message: string; field?: string } {
  if (
    error && 
    typeof error === 'object' && 
    'code' in error && 
    'constraint_name' in error
  ) {
    const pgError = error as PostgresError;
    
    if (pgError.constraint_name === 'users_username_unique') {
      return { 
        message: 'this username is already taken. please choose a different one.', 
        field: 'username' 
      };
    }
    
    if (pgError.constraint_name === 'users_email_unique') {
      return { 
        message: 'an account with this email already exists.', 
        field: 'email' 
      };
    }
    
    // generic constraint message
    return { message: 'this value is already in use. please choose a different one.' };
  }
  
  return { message: 'an unexpected error occurred. please try again.' };
}
