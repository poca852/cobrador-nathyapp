import * as moment from "moment";
import { getDate } from "src/app/helpers/getDate";
import { Credito } from "src/app/models";

export const getDiasDeAtraso = (credito: Credito): number => {

   let fecha_inicio = moment(getDate(credito.fecha_inicio));
   let fecha_fin = moment(getDate(credito.ultimo_pago));

   return fecha_fin.diff(fecha_inicio, 'days');

}