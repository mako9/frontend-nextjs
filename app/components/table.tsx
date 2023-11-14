import React from 'react'
import { useTable } from 'react-table'
import styles from '../styles/table.module.css'
import Link from 'next/link'

function Table({ columns, data, noValueText = 'No values' }) {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data })

    return (
        <table className={styles.table} {...getTableProps()}>
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th
                                className={styles[column.className]}
                                {...column.getHeaderProps()}
                            >
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.length <= 0 ? (
                    <tr>
                        <td colSpan={columns.length}>
                            <p>{noValueText}</p>
                        </td>
                    </tr>
                ) : (
                    rows.map((row) => {
                        prepareRow(row)
                        return (
                            <tr
                                {...row.getRowProps()}
                                className={
                                    row.index % 2 === 0 ? '' : styles.tr_colored
                                }
                            >
                                {row.cells.map((cell) => {
                                    const linkParams = cell.column.linkParams
                                    return (
                                        <td {...cell.getCellProps()}>
                                            {linkParams ? (
                                                <Link
                                                    href={{
                                                        pathname: `${linkParams.href}/${row.original.uuid}`,
                                                        query: linkParams.query,
                                                    }}
                                                >
                                                    {cell.render('Cell')}
                                                </Link>
                                            ) : (
                                                <div>{cell.render('Cell')}</div>
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })
                )}
            </tbody>
        </table>
    )
}

export default Table
