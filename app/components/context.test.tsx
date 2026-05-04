import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { StateProvider, useStateValue } from './context'

function TestConsumer() {
    const { state, setState } = useStateValue()
    return (
        <div>
            <span data-testid="loading">{String(state.isLoading)}</span>
            <span data-testid="navIndex">{state.selectedNavbarIndex}</span>
            <button onClick={() => setState({ ...state, isLoading: true })}>
                Set Loading
            </button>
        </div>
    )
}

describe('StateProvider / useStateValue', () => {
    test('provides default state to consumers', () => {
        render(
            <StateProvider>
                <TestConsumer />
            </StateProvider>
        )
        expect(screen.getByTestId('loading').textContent).toBe('false')
        expect(screen.getByTestId('navIndex').textContent).toBe('0')
    })

    test('state updates propagate to consumers', () => {
        render(
            <StateProvider>
                <TestConsumer />
            </StateProvider>
        )
        act(() => {
            screen.getByText('Set Loading').click()
        })
        expect(screen.getByTestId('loading').textContent).toBe('true')
    })
})
