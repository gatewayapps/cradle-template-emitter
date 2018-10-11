import { expect } from 'chai'
import 'mocha'
import { getLanguageType, mapDataTypes, mapDefaultValues } from './utils'

describe('TemplateEmitter', () => {
  describe('languageType', () => {
    it('should return the language type, given mongoose and a path', () => {
      expect(getLanguageType('mongoose', './this/is/a/path/file.ts')).to.equal('mongoose')
    })
    it('should return the language type, given no language type and a path', () => {
      expect(getLanguageType('', './this/is/a/path/file.ts')).to.equal('ts')
    })
    it('should return empty string, given no parameters', () => {
      expect(getLanguageType('', '')).to.equal('')
    })
    it('should return empty string, given no language type and a bad path', () => {
      expect(getLanguageType('', './this/is/a/path/')).to.equal('')
    })
    it('should return the language type, given no language type and an absolute path', () => {
      expect(getLanguageType('', 'C:\\this\\is\\a\\relative\\path\\file.js')).to.equal('js')
    })
  })
  describe('mapping data types', () => {
    it('should return number, given Integer and ts mapping file', () => {
      expect(mapDataTypes('Integer', require('./mappings/ts/mapping.ts'))).to.equal('number')
    })
    it('should return empty string, given no value and a ts mapping file', () => {
      expect(mapDataTypes('', require('./mappings/ts/mapping.ts'))).to.equal('')
    })
    it('should return the non mapped data type, given a non mapped data type', () => {
      expect(mapDataTypes('Wahoo', require('./mappings/js/mapping.ts'))).to.equal('Wahoo')
    })
  })
  describe('mapping default values', () => {
    it('should return Work, given "Work"', () => {
      expect(mapDefaultValues('String', 'Work', require('./mappings/ts/mapping.ts'))).to.equal('Work')
    })
    it('should return Date.now, given "DateTime" and "DateTimeNow"', () => {
      expect(mapDefaultValues('DateTime', 'DateTimeNow', require('./mappings/mongoose/mapping.ts'))).to.equal('Date.now')
    })
    it('should return nothing, given nothing', () => {
      expect(mapDefaultValues('', '', require('./mappings/mongoose/mapping.ts'))).to.equal('')
    })
    it('should return the default value, given no mapping', () => {
      expect(mapDefaultValues('', 'DataType', {})).to.equal('DataType')
    })
  })
})
