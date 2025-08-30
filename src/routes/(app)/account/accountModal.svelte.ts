export const deleteUserModal = $state<{show: boolean}>({ show: false });
export const changeUsernameModal = $state<{show: boolean, username: string | null }>({ show: false, username: '' });