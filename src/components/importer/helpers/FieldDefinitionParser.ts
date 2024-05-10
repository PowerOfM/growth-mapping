import type { FieldDefinition } from '@/DataTypes'

export type IFieldInputDefinition = {
  isComplex: boolean
  complexValue: string
  columnIndex?: number
}

export class FieldDefinitionParser {
  public static parse(
    input: IFieldInputDefinition,
    headers: string[],
  ): FieldDefinition | null {
    if (!input.isComplex) {
      if (input.columnIndex != undefined) {
        return [input.columnIndex]
      }
      return null
    }

    return this.parseComplex(input.complexValue, headers)
  }

  private static parseComplex(
    value: string,
    headers: string[],
  ): FieldDefinition | null {
    const fieldDefinition: FieldDefinition = []

    // Convert {Header} to indices
    let cursor = -1
    let i = -1
    while ((i = value.indexOf('{', cursor)) >= 0) {
      if (i - cursor > 1) {
        fieldDefinition.push(value.slice(cursor + 1, i))
      }
      cursor = value.indexOf('}', i)
      if (cursor < i) {
        console.error(
          `Invalid Field Definition: no matching "}" after "${value.slice(i)}"`,
        )
        return null
      }

      const header = value.substring(i + 1, cursor)
      const headerIndex = headers.indexOf(header)
      if (headerIndex < 0) {
        console.error(
          `Invalid Field Definition: no header with the name "${header}"`,
        )
        return null
      }
      fieldDefinition.push(headerIndex)
    }
    if (cursor < value.length - 1) {
      fieldDefinition.push(value.slice(cursor + 1))
    }

    // Array of [str, index, ...]
    return fieldDefinition
  }
}
