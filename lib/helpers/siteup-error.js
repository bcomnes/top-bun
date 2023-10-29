/** @typedef { 'SITEUP_ERROR_DUPLICATE_PAGE' } SiteupErrorCode */

/**
 * Siteup Duplicate Page Error
 * @extends {Error}
 */
export class SiteupDuplicatePageError extends Error {
  duplicates
  /**
   * Error code
   * @type {SiteupErrorCode}
   */

  /**
   * Constructs a new SiteupAggregateError instance.
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
   * @returns {SiteupErrorCode}
   */
  get code () {
    return 'SITEUP_ERROR_DUPLICATE_PAGE'
  }
}

/** @typedef { 'SITEUP_WARNING_DUPLICATE_LAYOUT' } SiteupWarningCode */

/**
 * @typedef SiteupWarning
 * @property {SiteupWarningCode} code - The warning code
 * @property {string} message - A human readable message with details
 */
