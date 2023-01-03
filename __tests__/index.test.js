import { render, cleanup } from '@testing-library/react'
import Home from '../pages/index'
import '@testing-library/jest-dom'

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

test('renders the component with the correct data', () => {
  const allCommunitiesData = [
    { uuid: '95C87636-8320-4155-AEEF-1BA973C872CA', name: 'Community 1', createdAt: '2022-01-01' },
    { uuid: '15C87636-8320-4155-AEEF-1BA973C872CA', name: 'Community 2', createdAt: '2022-01-02' },
  ];

  const { getByText } = render(
      <Home allCommunitiesData={allCommunitiesData} />
  );

  expect(getByText('Community 1')).toBeInTheDocument();
  expect(getByText('Community 2')).toBeInTheDocument();
});