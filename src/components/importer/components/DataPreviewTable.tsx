import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface IProps {
  data: string[][]
  previewRows?: number
}

export const DataPreviewTable = ({ data, previewRows = 5 }: IProps) => {
  const headers = data[0] ?? []
  const rows = data.slice(1, previewRows)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((value, i) => (
            <TableHead key={i}>{value}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, i) => (
          <TableRow key={i}>
            {row.map((value, j) => (
              <TableCell key={j}>{value}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
