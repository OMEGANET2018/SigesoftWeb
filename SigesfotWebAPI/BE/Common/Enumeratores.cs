﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE.Common
{
   public class Enumeratores
    {

        public enum TypeForm
        {
            Windows = 1,
            Web = 2,
            Asistencial = 3
        }

        public enum SiNo
        {
            No = 0,
            Si = 1
        }

        public enum Parameters
        {
            OrgType = 103,
            TypeMovement = 109,
            Gender = 100
        }

        public enum DataHierarchy
        {
            TypeDoc = 106,
            CategoryProd = 103,
            MeasurementUnit = 150,
            
        }
        public enum RecordStatus
        {
            Grabado = 1,
            Agregar = 2,
            Editar = 3,
            Eliminar = 4
        }

        public enum masterService
        {
            Ocupational = 2,
            //Assistence = 10,
            Control = 21
        }

        public enum ServiceStatus
        {
            PorIniciar = 1,
            Iniciado = 2,
            Culminado = 3,
            Incompleto = 4,
            Cancelado = 5,
            EsperandoAptitud = 6
        }

        public enum AptitudeStatus
        {
            SinAptitud = 1,
            Apto = 2,
            NoApto = 3,
            Observado = 4,
            AptoRestriccion = 5,
            Asistencial = 6,
            Evaluado = 7
        }

        public enum FinalQualification
        {
            SinCalificar = 1,
            Definitivo = 2,
            Presuntivo = 3,
            Descartado = 4

        }

        public enum EsoType
        {
            PreOcupacional = 1,
            PeriodicoAnual = 2,
            Retiro = 3,
            Preventivo = 4,
            Reubicacion = 5,
            Chequeo = 6,
            Visita = 7


        }
    }
}
