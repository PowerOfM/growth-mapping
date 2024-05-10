import { observer } from 'mobx-react-lite'
import { FC, useState } from 'react'
import { Dialog, DialogContent } from '../ui/dialog'
import {
  DEFAULT_FIELD_INPUT,
  DEFAULT_IMPORTER_DEFINITION,
  IImporterDefintion,
  IImporterStepProps,
  ImporterStep,
} from './ImporterTypes'
import { IFieldInputDefinition } from './helpers/FieldDefinitionParser'
import { UploadStep } from './steps/UploadStep'

interface IProps {
  open: boolean
  onClose(): void
}

const STEP_COMPONENTS: Record<ImporterStep, FC<IImporterStepProps>> = {
  [ImporterStep.Upload]: UploadStep,
  [ImporterStep.Definition]: UploadStep,
  [ImporterStep.Process]: UploadStep,
  [ImporterStep.Complete]: UploadStep,
}

export const ImporterDialog = observer(({ open, onClose }: IProps) => {
  const [step, setStep] = useState<ImporterStep>(ImporterStep.Upload)
  const [closeable, setCloseable] = useState(true)

  const [addressInputField, setAddressInputField] =
    useState<IFieldInputDefinition>(DEFAULT_FIELD_INPUT)
  const [labelInputField, setLabelInputField] =
    useState<IFieldInputDefinition>(DEFAULT_FIELD_INPUT)
  const [tableData, setTableData] = useState<string[][] | undefined>()
  const [definition, setDefinition] = useState<IImporterDefintion>(
    DEFAULT_IMPORTER_DEFINITION,
  )

  const stepForward = (closeable = true) => {
    setStep((prev) => (prev < ImporterStep.Complete ? prev + 1 : prev))
    setCloseable(closeable)
  }
  const stepBackwards = (closeable = true) => {
    setStep((prev) => (prev > ImporterStep.Upload ? prev - 1 : prev))
    setCloseable(closeable)
  }

  const StepComponent = STEP_COMPONENTS[step]

  return (
    <Dialog modal open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <StepComponent
          step={step}
          closeable={closeable}
          stepForward={stepForward}
          stepBackward={stepBackwards}
          reset={() => console.log('Reset!')}
          addressInputField={addressInputField}
          labelInputField={labelInputField}
          tableData={tableData}
          definition={definition}
          onAddressInputFieldChange={setAddressInputField}
          onLabelInputFieldChange={setLabelInputField}
          onTableDataChange={setTableData}
          onDefinitionChange={setDefinition}
        />
      </DialogContent>
    </Dialog>
  )
})
