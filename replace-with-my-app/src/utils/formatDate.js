import doFormatDate from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import isValid from 'date-fns/isValid';

export default function formatDate(rvalue, format = 'MM/dd/yyyy') {
  let value = parseISO(rvalue);
  return isValid(value) ? doFormatDate(value, format) : '';
}
