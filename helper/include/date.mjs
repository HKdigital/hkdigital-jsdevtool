
/* ---------------------------------------------------------------- Internals */

/**
 * Convert a number or numeric string value to a two digit string
 * - A `0` will be prefixed if the number is smaller than 10
 *
 * @param {number} value
 *
 * @returns {string} two digit numeric string
 */
function twoDigits( value )
{
  if( Math.abs(value) < 10 )
  {
    return (value > 0 ? '' : '-') + '0' + Math.abs(value);
  }
  else {
    return '' + value;
  }
}

/* ------------------------------------------------------------------ Exports */

/**
 * Generate a timestamp that can be used to create datetime dependent folder
 * names
 *
 * @returns {string} date time stamp
 */
export function generateFolderDateTimeStamp()
{
  const d = new Date();

  const year = d.getFullYear();
  const month = twoDigits( d.getMonth() + 1 );
  const day = twoDigits( d.getDate() );
  const hours = twoDigits( d.getHours() );
  const minutes = twoDigits( d.getMinutes() );
  const seconds = twoDigits( d.getSeconds() );

  const offset = twoDigits(d.getTimezoneOffset() / 60 );

  return `${year}-${month}-${day}~${hours}_${minutes}_${seconds}~${offset}`;
}