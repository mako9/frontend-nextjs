import React from 'react'
import { render, screen } from '@testing-library/react'
import Table from './table'

jest.mock('react-table', () => ({
    useTable: ({ columns, data }: { columns: any[]; data: any[] }) => ({
        getTableProps: () => ({}),
        getTableBodyProps: () => ({}),
        headerGroups: [
            {
                getHeaderGroupProps: () => ({}),
                headers: columns.map((col) => ({
                    getHeaderProps: () => ({}),
                    render: (type: string) =>
                        type === 'Header' ? col.Header : null,
                    className: col.className,
                })),
            },
        ],
        rows: data.map((row, index) => ({
            getRowProps: () => ({}),
            index,
            cells: columns.map((col) => ({
                getCellProps: () => ({}),
                column: { linkParams: col.linkParams },
                render: (type: string) =>
                    type === 'Cell' ? row[col.accessor] : null,
            })),
            original: row,
        })),
        prepareRow: jest.fn(),
    }),
}))

const columns = [
    { Header: 'Name', accessor: 'name', className: 'th_round_left' },
    { Header: 'City', accessor: 'city', className: 'th_round_right' },
]

describe('Table', () => {
    test('renders column headers', () => {
        render(<Table columns={columns} data={[]} />)
        expect(screen.getByText('Name')).toBeInTheDocument()
        expect(screen.getByText('City')).toBeInTheDocument()
    })

    test('renders row data', () => {
        const data = [{ name: 'Test Community', city: 'Munich' }]
        render(<Table columns={columns} data={data} />)
        expect(screen.getByText('Test Community')).toBeInTheDocument()
        expect(screen.getByText('Munich')).toBeInTheDocument()
    })

    test('shows noValueText when data is empty', () => {
        render(
            <Table columns={columns} data={[]} noValueText="Nothing here" />
        )
        expect(screen.getByText('Nothing here')).toBeInTheDocument()
    })
})
