
// -----------------------------------------------------------------------------

/**
 * Expect a value to be a string
 *
 * @param {mixed} value - Value to check
 */
export function expectString( value, errorText )
{
  if( typeof value !== 'string' )
  {
    throw new Error( `${errorText} (expected string)`);
  }
}

// -----------------------------------------------------------------------------

/**
 * Expect a value to be a string and not empty
 *
 * @param {mixed} value - Value to check
 */
export function expectNotEmptyString( value, errorText )
{
  if( typeof value !== 'string' || 0 === value.length )
  {
    throw new Error( `${errorText} (expected not empty string)`);
  }
}

// -----------------------------------------------------------------------------

/**
 * Expect a value to be an object
 *
 * @param {mixed} value - Value to check
 */
export function expectObject( value, errorText )
{
  if( !(value instanceof Object || (value && typeof value === 'object') ) ||
      value instanceof Promise )
  {
    throw new Error( `${errorText} (expected object)`);
  }
}
