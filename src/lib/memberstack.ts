// Memberstack configuration and utilities
'use client';

// Types for Memberstack
export interface MemberstackUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  planType?: string;
  createdAt: string;
  updatedAt: string;
}

// Initialize Memberstack DOM SDK with error handling
let memberstackDOM: unknown = null;

export const initMemberstack = () => {
  if (typeof window !== 'undefined' && !memberstackDOM) {
    try {
      // Dynamic import to avoid SSR issues
      import('@memberstack/dom').then((MemberStack) => {
        const publicKey = process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY;
        if (publicKey) {
          memberstackDOM = MemberStack.default.init({
            publicKey: publicKey,
          });
        } else {
          console.warn('Memberstack public key not found. Please add NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY to your environment variables.');
        }
      }).catch((error) => {
        console.error('Failed to initialize Memberstack:', error);
      });
    } catch (error) {
      console.error('Error importing Memberstack:', error);
    }
  }
  return memberstackDOM;
};

// Get Memberstack instance
export const getMemberstack = () => {
  if (!memberstackDOM) {
    initMemberstack();
  }
  return memberstackDOM;
};

// Initialize on module load
if (typeof window !== 'undefined') {
  initMemberstack();
}

export { memberstackDOM }; 