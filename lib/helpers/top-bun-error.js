/** @typedef { 'TOP_BUN_ERROR_DUPLICATE_PAGE' } TopBunErrorCode */

/**
 * TopBun Duplicate Page Error
 * @extends {Error}
 */
export class TopBunDuplicatePageError extends Error {
  duplicates
  /**
   * Error code
   * @type {TopBunErrorCode}
   */

  /**
   * Constructs a new TopBunAggregateError instance.
   *
   * @param {string} message - The error message
   * @param {{ a: string, b: string }} duplicates - Extra params
   * @param {ErrorOptions} [opts] - The opts object from the Error class
   */
  constructor (message, duplicates, opts) {
    super(message, opts)
    this.duplicates = duplicates
  }

  /**
   * @returns {TopBunErrorCode}
   */
  get code () {
    return 'TOP_BUN_ERROR_DUPLICATE_PAGE'
  }
}

/** @typedef { 'TOP_BUN_WARNING_DUPLICATE_LAYOUT' } TopBunWarningCode */

/**
 * @typedef TopBunWarning
 * @property {TopBunWarningCode} code - The warning code
 * @property {string} message - A human readable message with details
 */
