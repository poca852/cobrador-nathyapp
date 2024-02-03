import * as moment from 'moment';

export const momentPlugin = () => {

   return moment().utc(true).format('DD/MM/YYYY');

}