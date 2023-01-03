// __tests__/snapshot.js

import { render, cleanup } from '@testing-library/react'
import Home from '../pages/index'

afterEach(cleanup);

jest.mock('next-auth/react', () => {
  return {
    useSession: jest.fn(() => {
      return {
        user: {
          email: 'test@example.com',
          name: 'Test User',
        },
        signin: jest.fn(),
        signout: jest.fn(),
      };
    }),
  };
});

it('renders homepage unchanged', () => {
  const { container } = render(
      <Home allCommunitiesData={[]} />
  )
  expect(container).toMatchSnapshot()
})