import { FieldDefinition, IManagedCollection } from '@/DataTypes'
import { IFieldInputDefinition } from './helpers/FieldDefinitionParser'

export enum ImporterStep {
  Upload,
  Definition,
  Process,
  Complete,
}

export interface IImporterStepProps {
  step: ImporterStep
  closeable: boolean
  stepForward(): void
  stepBackward(): void
  reset(): void

  addressInputField: IFieldInputDefinition
  onAddressInputFieldChange(value: IFieldInputDefinition): void

  labelInputField: IFieldInputDefinition
  onLabelInputFieldChange(value: IFieldInputDefinition): void

  tableData?: string[][]
  onTableDataChange(value: string[][]): void

  definition: IImporterDefintion
  onDefinitionChange(value: IImporterDefintion): void
}

export interface IImporterDefintion {
  collection?: IManagedCollection
  addressField: FieldDefinition
  labelField: FieldDefinition
}

export const DEFAULT_FIELD_INPUT: IFieldInputDefinition = {
  isComplex: false,
  complexValue: '',
  columnIndex: undefined,
}

export const DEFAULT_IMPORTER_DEFINITION: IImporterDefintion = {
  addressField: [],
  labelField: [],
}
