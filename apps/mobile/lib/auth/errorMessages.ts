export const getErrorMessage = (error: any): string => {
  switch (error.code) {
    case 'auth/invalid-credential':
      return 'Invalid email or password';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Try again later.';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    default:
      return error.message || 'An unexpected error occurred';
  }
};