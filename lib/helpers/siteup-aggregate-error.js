/**
 * @typedef {import('../builder.js').BuildStepErrors} BuildStepErrors
 */

/**
 * Represents an aggregation of multiple errors specific to Siteup.
 * This class extends the built-in AggregateError class and adds additional properties specific to Siteup's context.
 * @extends {AggregateError}
 */
export class SiteupAggregateError extends AggregateError {
  /**
   * Contains the results associated with the aggregated errors.
   * @type {any}
   */
  results

  /**
   * Constructs a new SiteupAggregateError instance.
   *
   * @param {BuildStepErrors} errors - An array of error objects to be aggregated.
   * @param {string} message - A message describing the aggregation of errors.
   * @param {any} results - The results associated with the aggregated errors.
   */
  constructor (errors, message, results) {
    super(errors, message)
    this.results = results
  }
}
