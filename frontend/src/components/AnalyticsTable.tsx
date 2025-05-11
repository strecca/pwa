import React from "react";
import {
    useReactTable,
    createColumnHelper,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";

type SubmissionData = {
    formId: string;
    userId: string;
    submissionData: Record<string, any>;
    syncedAt: string;
};

type AnalyticsTableProps = {
    data: SubmissionData[];
};

const AnalyticsTable: React.FC<AnalyticsTableProps> = ({ data }) => {
    const columnHelper = createColumnHelper<SubmissionData>();

    const columns = [
        columnHelper.accessor("formId", {
            header: "Form ID",
        }),
        columnHelper.accessor("userId", {
            header: "User ID",
        }),
        columnHelper.accessor("submissionData", {
            header: "Submission Data",
            cell: (info) => JSON.stringify(info.getValue()),
        }),
        columnHelper.accessor("syncedAt", {
            header: "Submission Date",
            cell: (info) => new Date(info.getValue()).toLocaleDateString(),
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <table>
            <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th key={header.id}>
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                        {row.getAllCells().map((cell) => (
                            <td key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default AnalyticsTable;
