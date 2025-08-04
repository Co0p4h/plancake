// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/session').SessionValidationResult['user'];
			session: import('$lib/server/session').SessionValidationResult['session'];
			schedule: import('$lib/server/session').SessionValidationResult['schedule'];
		}
	}
}

export {};
