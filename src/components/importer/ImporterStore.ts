import { CollectionsStore } from '@/CollectionsStore'
import { FieldDefinition, IManagedCollection, ITable } from '@/DataTypes'
import { IFieldInputDefinition } from './helpers/FieldDefinitionParser'
import { TableBuilder } from './helpers/TableBuilder'
import { makeObservable, observable } from 'mobx'

export enum ImporterStep {
  Upload,
  Definition,
  Process,
  Complete,
}

interface IDefintion {
  collection?: IManagedCollection
  addressField: FieldDefinition
  labelField: FieldDefinition
}

const MAX_STEP = ImporterStep.Complete
const DEFAULT_FIELD_INPUT: IFieldInputDefinition = {
  isComplex: false,
  complexValue: '',
  columnIndex: undefined,
}

class ImporterStoreClass {
  public step: ImporterStep = ImporterStep.Upload
  public closeable = true

  public addressInputField = DEFAULT_FIELD_INPUT
  public labelInputField = DEFAULT_FIELD_INPUT

  public tableData: string[][] = []
  public definition: IDefintion = { addressField: [], labelField: [] }
  // public builder = {
  //   abortController: new AbortController(),
  //   progress: 0,
  //   result: undefined as ITable | undefined,
  // }

  constructor() {
    makeObservable(this, {
      step: observable,
      closeable: observable,
    })
  }

  public stepForward(closeable = true) {
    if (this.step < MAX_STEP) {
      this.step++
      this.closeable = closeable
    }
  }
  public stepBackwards(closeable = true) {
    if (this.step > ImporterStep.Upload) {
      this.step--
      this.closeable = closeable
    }
  }

  // public setBuildProgress(value: number, result?: ITable) {
  //   this.builder.progress = value
  //   this.builder.result = result
  // }

  // public async runProcessor() {
  //   const abortController = new AbortController()
  //   const collectionId = this.definition.collection?.id || 'UNSET_COLLECTION_ID'

  //   this.builder = {
  //     abortController,
  //     progress: 0,
  //     result: undefined,
  //   }

  //   const tableDefinitionData = this.definition
  //   const tableBuilder = new TableBuilder(
  //     tableDefinitionData.addressField,
  //     tableDefinitionData.labelField,
  //     abortController.signal,
  //   )

  //   tableBuilder.onStep((value) => {
  //     this.setBuildProgress(value)
  //   })

  //   const result = await tableBuilder.build(this.tableData)
  //   CollectionsStore.addTable(collectionId, result)

  //   this.setBuildProgress(100, result)
  //   this.stepForward()
  // }
}
