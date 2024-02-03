export interface Ruta {
   _id: string;
   nombre: string
   clientes: number;
   clientes_activos: number;
   gastos: number;
   inversiones: number;
   retiros: number;
   ciudad: string;
   cartera: number
   total_cobrado: number;
   total_prestado: number;
   status: boolean
   ultimo_cierre: string;
   ultima_apertura: string;
   ingresar_gastos_cobrador: boolean;
   caja_actual: string;
   ultima_caja: string;
   turno: number;
   empresa?: string;
}