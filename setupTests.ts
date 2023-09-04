import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import { afterEach } from 'node:test';

afterEach(cleanup);

jest.mock('next-auth/react', () => {
  return {
    useSession: jest.fn(() => {
      return {
        user: {
          email: 'test@example.com',
          name: 'Test User',
        },
        status: 'authenticated',
        signin: jest.fn(),
        signout: jest.fn(),
      };
    }),
  };
});

jest.mock('next-auth', () => jest.fn());

jest.mock('next-auth/next', () => {
  return {
    unstable_getServerSession: jest.fn(() => {
      return {
        accessToken: 'token',
        user: {
          email: 'test@example.com',
          name: 'Test User',
        },
        status: 'authenticated',
      };
    }),
  };
});