import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { inputTWS } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChangeEvent, useState } from 'react'
import { toast } from 'sonner'
import { IImporterStepProps } from '../ImporterTypes'
import { DataPreviewTable } from '../components/DataPreviewTable'
import { CSVParser } from '../helpers/CSVParser'

export const UploadStep = ({
  stepForward,
  tableData,
  onTableDataChange,
  reset,
}: IImporterStepProps) => {
  const [inputValue, setInputValue] = useState('')

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    const files = e.target.files
    if (files?.length) {
      CSVParser.parse(files[0])
        .then((result) => {
          if (result.errors) console.error('Error parsing', result.errors)
          else onTableDataChange(result.data)
        })
        .catch(console.error)
    }
  }

  const handleNext = () => {
    if (!tableData) {
      toast.error('Please select a file')
      return
    }
    stepForward()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Import Data</DialogTitle>
        <DialogDescription>
          Only CSV files are supported. If you have an Excel or Numbers file,
          please save it as the CSV format.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-3 grid w-full gap-1.5">
        <Label htmlFor="importer-csv-fle">CSV File</Label>
        <input
          id="importer-csv-fle"
          className={inputTWS}
          type="file"
          value={inputValue}
          onChange={handleFile}
        />
      </div>

      {tableData && (
        <div className="mt-3 grid w-full gap-1.5">
          <Label>Preview</Label>
          <DataPreviewTable data={tableData} />
          <p className="text-sm text-secondary">
            +{tableData.length - 5} lines
          </p>
        </div>
      )}

      <DialogFooter>
        {tableData && (
          <Button type="button" variant="secondary" onClick={reset}>
            Clear
          </Button>
        )}

        <Button type="button" onClick={handleNext}>
          Next
        </Button>
      </DialogFooter>
    </>
  )
}
