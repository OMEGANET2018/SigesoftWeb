﻿
using BE.Common;
using BE.MedicalAssistance;
using DAL;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using static BE.Common.Enumeratores;

namespace BL.MedicalAssistance
{
    public class PatientsAssistanceBL
    {
        private DatabaseContext ctx = new DatabaseContext();

        public BoardPatient GetAllPatientsAssistanceOld(BoardPatient data)
        {
            try
            {
                //Thread.Sleep(20000);
                var isDeleted = (int)Enumeratores.SiNo.No;
                int groupDocTypeId = (int)Enumeratores.DataHierarchy.TypeDoc;
                int genderId = (int)Enumeratores.Parameters.Gender;
                int skip = (data.Index - 1) * data.Take;

                string filterPacient = string.IsNullOrWhiteSpace(data.Patient) ? "" : data.Patient;
                var startDate = data.StartDate.ToString() == "" ? DateTime.Parse("01/01/2000") : data.StartDate;
                var endDate = data.EndDate.ToString() == "" ? DateTime.Parse("01/01/2020") : data.EndDate;

                var preList = (from a in ctx.Service
                               join b in ctx.Person on a.v_PersonId equals b.v_PersonId
                               join c in ctx.DataHierarchy on new { a = b.i_DocTypeId.Value, b = groupDocTypeId } equals new { a = c.i_ItemId, b = c.i_GroupId }
                               join d in ctx.SystemParameter on new { a = b.i_SexTypeId.Value, b = genderId } equals new { a = d.i_ParameterId, b = d.i_GroupId }
                               join e in ctx.Protocol on a.v_ProtocolId equals e.v_ProtocolId
                               join f in ctx.Organization on e.v_CustomerOrganizationId equals f.v_OrganizationId
                               join g in ctx.Location on e.v_CustomerLocationId equals g.v_LocationId
                               join h in ctx.GroupOccupation on e.v_GroupOccupationId equals h.v_GroupOccupationId
                               join i in ctx.SystemParameter on new { a = a.i_MasterServiceId.Value, b = 119 } equals new { a = i.i_ParameterId, b = i.i_GroupId }
                               where a.i_IsDeleted == isDeleted
                                       && (b.v_FirstName.Contains(filterPacient) || b.v_FirstLastName.Contains(filterPacient) || b.v_SecondLastName.Contains(filterPacient) || b.v_DocNumber.Contains(filterPacient))
                                         && (startDate < a.d_ServiceDate && endDate > a.d_ServiceDate)
                               select new Patients
                               {
                                   ServiceId = a.v_ServiceId,
                                   PatientId = a.v_PersonId,
                                   PatientFullName = b.v_FirstName + " " + b.v_FirstLastName + " " + b.v_SecondLastName,
                                   DocumentType = c.v_Value1,
                                   DocumentNumber = b.v_DocNumber,
                                   ServiceDate = a.d_ServiceDate.Value,
                                   Occupation = b.v_CurrentOccupation,
                                   Birthdate = b.d_Birthdate.Value,
                                   Gender = d.v_Value1,
                                   ProtocolName = e.v_Name,
                                   OrganizationLocation = f.v_Name + " " + g.v_Name,
                                   Geso = h.v_Name,
                                   MasterServiceId = a.i_MasterServiceId.Value,
                                   MasterService = i.v_Value1,
                                   IsRevisedHistoryId = a.i_IsRevisedHistoryId.Value
                               }).ToList();

                var list = (from a in preList
                            select new Patients
                            {
                                ServiceId = a.ServiceId,
                                PatientId = a.PatientId,
                                PatientFullName = a.PatientFullName,
                                DocumentType = a.DocumentType,
                                DocumentNumber = a.DocumentNumber,
                                ServiceDate = a.ServiceDate,
                                Occupation = a.Occupation,
                                Birthdate = a.Birthdate,
                                Age = Utils.GetAge(a.Birthdate.Value),
                                Gender = a.Gender,
                                ProtocolName = a.ProtocolName,
                                OrganizationLocation = a.OrganizationLocation,
                                Geso = a.Geso,
                                MasterServiceId = a.MasterServiceId,
                                MasterService = a.MasterService,
                                IsRevisedHistoryId = a.IsRevisedHistoryId
                            }).ToList();

                int totalRecords = list.Count;

                if (data.Take > 0)
                    list = list.Skip(skip).Take(data.Take).ToList();

                data.TotalRecords = totalRecords;
                data.List = list;

                return data;

            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public BoardPatient GetAllPatientsAssistance(BoardPatient data)
        {
            try
            {
                //Thread.Sleep(20000);
                var isDeleted = (int)Enumeratores.SiNo.No;
                int groupDocTypeId = (int)Enumeratores.DataHierarchy.TypeDoc;
                int genderId = (int)Enumeratores.Parameters.Gender;
                int skip = (data.Index - 1) * data.Take;

                string filterPacient = string.IsNullOrWhiteSpace(data.Patient) ? "" : data.Patient;
                var startDate = data.StartDate.ToString() == "" ? DateTime.Parse("01/01/2000") : data.StartDate;
                var endDate = data.EndDate.ToString() == "" ? DateTime.Parse("01/01/2020") : data.EndDate;

                var preList = (from a in ctx.OrganizationPerson
                               join b in ctx.Person on a.v_PersonId equals b.v_PersonId
                               join c in ctx.DataHierarchy on new { a = b.i_DocTypeId.Value, b = groupDocTypeId } equals new { a = c.i_ItemId, b = c.i_GroupId }
                               join d in ctx.SystemParameter on new { a = b.i_SexTypeId.Value, b = genderId } equals new { a = d.i_ParameterId, b = d.i_GroupId }
                               join f in ctx.Organization on a.v_OrganizationId equals f.v_OrganizationId
                               where (b.v_FirstName.Contains(filterPacient) || b.v_FirstLastName.Contains(filterPacient) || b.v_SecondLastName.Contains(filterPacient) || b.v_DocNumber.Contains(filterPacient))
                                    && (data.Workerstatus == -1 || a.i_IsDeleted == data.Workerstatus)

                               select new Patients
                               {
                                   PatientId = a.v_PersonId,
                                   PatientFullName = b.v_FirstName + " " + b.v_FirstLastName + " " + b.v_SecondLastName,
                                   DocumentType = c.v_Value1,
                                   DocumentNumber = b.v_DocNumber,
                                   Occupation = b.v_CurrentOccupation,
                                   Birthdate = b.d_Birthdate.Value,
                                   Gender = d.v_Value1,
                                   OrganizationLocation = f.v_Name,
                                   StatusOrganizationPerson = a.i_IsDeleted.Value
                               }).ToList();

                var list = (from a in preList
                            select new Patients
                            {
                                PatientId = a.PatientId,
                                PatientFullName = a.PatientFullName,
                                DocumentType = a.DocumentType,
                                DocumentNumber = a.DocumentNumber,
                                Occupation = a.Occupation,
                                Birthdate = a.Birthdate,
                                Age = Utils.GetAge(a.Birthdate.Value),
                                Gender = a.Gender,
                                OrganizationLocation = a.OrganizationLocation,
                                PendingEvent = PendingEvent(a.PatientId),
                                StatusOrganizationPerson = a.StatusOrganizationPerson
                            }).ToList();

                int totalRecords = list.Count;

                if (data.Take > 0)
                    list = list.Skip(skip).Take(data.Take).ToList();

                data.TotalRecords = totalRecords;
                data.List = list;

                return data;

            }
            catch (Exception ex)
            {
                throw;
            }
        }

        private string PendingEvent(string patientId)
        {
            try
            {
                var isDeleted = (int)Enumeratores.SiNo.No;
                var yesReviewed = (int)Enumeratores.SiNo.Si;
                var hasService = (from a in ctx.Service
                                  join b in ctx.Protocol on a.v_ProtocolId equals b.v_ProtocolId
                             where a.i_IsDeleted == isDeleted
                                    && a.v_PersonId == patientId
                                    //&& a.i_MasterServiceId.Value == (int)masterService.Ocupational 
                                    //&& a.i_MasterServiceId.Value != 1 
                                    //&& a.i_IsRevisedHistoryId != 1
                             select new Patients
                             {
                                 MasterServiceId = a.i_MasterServiceId.Value,
                                 IsRevisedHistoryId = a.i_IsRevisedHistoryId.Value,
                                 EsoTypeId = b.i_EsoTypeId.Value,
                                 ServiceStatusId = a.i_ServiceStatusId.Value

                             }).ToList();

                if (hasService.Count == 0)
                {
                    return "WITHOUTSERVICES";
                }
                else if(hasService.Count > 0 )
                {
                    var listHistoryByReviseEMOs = hasService.FindAll(p => p.IsRevisedHistoryId != yesReviewed && p.MasterServiceId == (int)masterService.Ocupational).ToList();
                    if (listHistoryByReviseEMOs.Count > 0)
                    {
                        var retiro = listHistoryByReviseEMOs.FindAll(p => p.EsoTypeId == (int)EsoType.Retiro).ToList();
                        if (retiro.Count > 0)
                        {
                            return "EMOR";
                        }
                        else{
                            return "EMO";
                        }
                    }
                    else
                    {
                        var pendingControls = hasService.FindAll(p => p.MasterServiceId == (int)masterService.Control && p.ServiceStatusId !=(int)ServiceStatus.Culminado).ToList();
                        if (pendingControls.Count > 0)
                        {
                            return "PENDINGCONTROLS";
                        }
                        else
                        {
                            return "WITHOUTSERVICES";
                        }
                    }
                }
                else
                {
                    return "WITHOUTSERVICES";
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public BoardPatient GetPendingReview_Old(BoardPatient data)
        {

            try
            {
                var isDeleted = (int)Enumeratores.SiNo.No;
                var count = (from a in ctx.Service
                             where a.i_IsDeleted == isDeleted && a.i_MasterServiceId.Value == (int)masterService.Ocupational && a.i_IsRevisedHistoryId != 1
                             select new Patients
                             {
                                 MasterServiceId = a.i_MasterServiceId.Value,
                             }).ToList();
                data.List = count;
                return data;
            }
            catch (Exception)
            {

                throw;
            }

        }

        public int GetPendingReview()
        {
            try
            {
                var isDeleted = (int)Enumeratores.SiNo.No;
                var x = new List<string>();
                var list = (from a in ctx.OrganizationPerson
                            where a.i_IsDeleted == isDeleted
                            select new
                            {
                                v_PersonId = a.v_PersonId
                            }).ToList();

                //****optimizar código*****//////
                foreach (var item in list)
                {
                    x.Add(item.v_PersonId);
                }
                //////*************////////////

                var services = (from a in ctx.Service
                                where a.i_IsDeleted == isDeleted
                                && a.i_MasterServiceId.Value == (int)masterService.Ocupational
                                && a.i_IsRevisedHistoryId != 1
                                && x.Contains(a.v_PersonId)
                                select new
                                {
                                    MasterServiceId = a.i_MasterServiceId.Value,
                                    personId = a.v_PersonId
                                }).ToList();

                var servicesByReview = services.GroupBy(g => g.personId).Select(s => s.First()).ToList();

                return servicesByReview.Count();
            }
            catch (Exception)
            {

                throw;
            }

        }

        public List<Schedule> GetSchedule()
        {
            try
            {
                int masterServiceId = (int)Enumeratores.masterService.Control;
                var isDeleted = (int)Enumeratores.SiNo.No;
                var list = (from a in ctx.Service
                            join b in ctx.Person on a.v_PersonId equals b.v_PersonId
                            where a.i_IsDeleted == isDeleted
                                     && a.i_MasterServiceId == masterServiceId
                            select new Schedule
                            {
                                PacientId = a.v_PersonId,
                                Pacient = b.v_FirstName + " " + b.v_FirstLastName + " " + b.v_SecondLastName,
                                ServiceDate = a.d_ServiceDate.Value
                            }).ToList();

                return list;

            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public List<TopDiagnostic> TopDiagnostic()
        {
            try
            {
                //Thread.Sleep(5000);
                var isDeleted = (int)Enumeratores.SiNo.No;
                var list = (from a in ctx.DiagnosticRepository
                            join b in ctx.Diseases on a.v_DiseasesId equals b.v_DiseasesId
                            join c in ctx.Service on a.v_ServiceId equals c.v_ServiceId
                            where a.i_IsDeleted == isDeleted && a.i_FinalQualificationId == (int)FinalQualification.Definitivo
                             && c.i_MasterServiceId == (int)masterService.Control
                            select new
                            {
                                DiagnosticId = a.v_DiseasesId,
                                Diagnostic = b.v_Name,
                                MasterServiceId = c.i_MasterServiceId
                            }).ToList();

                var group = list
                            .GroupBy(n => n.Diagnostic)
                            .Select(n => new TopDiagnostic
                            {
                                name = n.Key,
                                y = n.Count()
                            }).OrderByDescending(n => n.y).Take(10);

                return group.ToList();

            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public List<TopDiagnostic> TopDiagnosticOcupational()
        {
            try
            {

                var isDeleted = (int)Enumeratores.SiNo.No;
                var list = (from a in ctx.DiagnosticRepository
                            join b in ctx.Diseases on a.v_DiseasesId equals b.v_DiseasesId
                            join c in ctx.Service on a.v_ServiceId equals c.v_ServiceId
                            where a.i_IsDeleted == isDeleted && a.i_FinalQualificationId == (int)FinalQualification.Definitivo
                                    && c.i_MasterServiceId == (int)masterService.Ocupational
                            select new
                            {
                                DiagnosticId = a.v_DiseasesId,
                                Diagnostic = b.v_Name,
                                MasterServiceId = c.i_MasterServiceId
                            }).ToList();

                var countList = (from a in ctx.OrganizationPerson
                                 join b in ctx.Organization on a.v_OrganizationId equals b.v_OrganizationId
                                 join c in ctx.Person on a.v_PersonId equals c.v_PersonId
                                 where a.i_IsDeleted == isDeleted
                                 select new Patients
                                 {
                                     PatientId = a.v_PersonId,
                                 }).ToList();


                var group = list
                            .GroupBy(n => n.Diagnostic)
                            .Select(n => new TopDiagnostic
                            {
                                count = countList.Count,
                                name = n.Key,
                                y = n.Count()
                            }).OrderByDescending(n => n.y).Take(10);

                return group.ToList();

            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public Indicators IndicatorByPacient(string patientId)
        {
            try
            {
                var serviceData = (from E in ctx.Person
                                   join A in ctx.Service on E.v_PersonId equals A.v_PersonId into A_join
                                   from A in A_join.DefaultIfEmpty()
                                   join F in ctx.OrganizationPerson on E.v_PersonId equals F.v_PersonId 
                                   join G in ctx.Organization on F.v_OrganizationId equals G.v_OrganizationId
                                   where E.v_PersonId == patientId && E.i_IsDeleted == 0
                                   select new
                                   {
                                       FullName = E.v_FirstName + " " + E.v_FirstLastName + " " + E.v_SecondLastName,
                                       Puesto = E.v_CurrentOccupation,
                                       Empresa = G.v_Name,
                                   }).ToList();


                var serviceComponentFieldValues = (from A in ctx.Service
                                                   join B in ctx.ServiceComponent on A.v_ServiceId equals B.v_ServiceId
                                                   join C in ctx.ServiceComponentFields on B.v_ServiceComponentId equals C.v_ServiceComponentId
                                                   join D in ctx.ServiceComponentFieldValues on C.v_ServiceComponentFieldsId equals D.v_ServiceComponentFieldsId
                                                   where A.v_PersonId == patientId
                                                           && (C.v_ComponentFieldId == Constants.COLESTEROL_TOTAL_Colesterol_Total_Id || C.v_ComponentFieldId == Constants.PERFIL_LIPIDICO_Colesterol_Total_Id || C.v_ComponentFieldId == Constants.GLUCOSA_Glucosa_Id || C.v_ComponentFieldId == Constants.HEMOGLOBINA_Hemoglobina_Id || C.v_ComponentFieldId == Constants.HEMOGRAMA_Hemoglobina_Id || C.v_ComponentFieldId == Constants.FUNCIONES_VITALES_Presion_Sistolica_Id || C.v_ComponentFieldId == Constants.FUNCIONES_VITALES_Presion_Distolica_Id || C.v_ComponentFieldId == Constants.ANTROPOMETRIA_Imc_Id || C.v_ComponentFieldId == Constants.ESPIROMETRIA_Cvf_Id)
                                                           && B.i_IsDeleted == 0
                                                           && C.i_IsDeleted == 0

                                                   select new
                                                   {

                                                       ServiceDate = A.d_ServiceDate,
                                                       ComponentFieldId = C.v_ComponentFieldId,
                                                       ServiceComponentFieldsId = C.v_ServiceComponentFieldsId,
                                                       Value1 = D.v_Value1,
                                                   }).ToList();
                Indicators oIndicators = new Indicators();
                oIndicators.PersonId = patientId;

                #region Data
                List<DataPatient> Data = new List<DataPatient>();
                var oDataPatient = new DataPatient();
                oDataPatient.Name = serviceData[0].FullName;
                oDataPatient.Empresa = serviceData[0].Empresa;
                oDataPatient.Puesto = serviceData[0].Puesto;
                Data.Add(oDataPatient);
                oIndicators.DataPatient = Data;
                #endregion

                #region IMC
                List<Weight> Weights = new List<Weight>();
                var ListWeights = serviceComponentFieldValues.FindAll(p => p.ComponentFieldId == Constants.ANTROPOMETRIA_Imc_Id);
                foreach (var item in ListWeights)
                {
                    var oWeight = new Weight();
                    oWeight.Date = item.ServiceDate.Value.ToString("dd-MM-yyyy");
                    oWeight.y = item.Value1;

                    Weights.Add(oWeight);
                }
                oIndicators.Weights = Weights;
                #endregion

                #region BloodPressureSis
                var BloodPressureSis = new List<BloodPressureSis>();
                var ListBloodPressureSis = serviceComponentFieldValues.FindAll(p => p.ComponentFieldId == Constants.FUNCIONES_VITALES_Presion_Sistolica_Id);
                foreach (var item in ListBloodPressureSis)
                {
                    var oBloodPressureSis = new BloodPressureSis();
                    oBloodPressureSis.Date = item.ServiceDate.Value.ToString("dd-MM-yyyy");
                    oBloodPressureSis.y = item.Value1;

                    BloodPressureSis.Add(oBloodPressureSis);
                }
                oIndicators.BloodPressureSis = BloodPressureSis;
                #endregion

                #region BloodPressureDia
                var BloodPressureDia = new List<BloodPressureDia>();
                var ListBloodPressureDia = serviceComponentFieldValues.FindAll(p => p.ComponentFieldId == Constants.FUNCIONES_VITALES_Presion_Distolica_Id);
                foreach (var item in ListBloodPressureDia)
                {
                    var oBloodPressureDia = new BloodPressureDia();
                    oBloodPressureDia.Date = item.ServiceDate.Value.ToString("dd-MM-yyyy");
                    oBloodPressureDia.y = item.Value1;

                    BloodPressureDia.Add(oBloodPressureDia);
                }
                oIndicators.BloodPressureDia = BloodPressureDia;
                #endregion

                #region Cholesterol
                var Cholesterol = new List<Cholesterol>();
                var ListCholesterol = serviceComponentFieldValues.FindAll(p => p.ComponentFieldId == Constants.COLESTEROL_TOTAL_Colesterol_Total_Id || p.ComponentFieldId == Constants.PERFIL_LIPIDICO_Colesterol_Total_Id);
                foreach (var item in ListCholesterol)
                {
                    var oCholesterol = new Cholesterol();
                    oCholesterol.Date = item.ServiceDate.Value.ToString("dd-MM-yyyy");
                    oCholesterol.y = item.Value1;

                    Cholesterol.Add(oCholesterol);
                }
                oIndicators.Cholesterols = Cholesterol;
                #endregion

                #region Glucoses
                var Glucoses = new List<Glucose>();
                var ListGlucoses = serviceComponentFieldValues.FindAll(p => p.ComponentFieldId == Constants.GLUCOSA_Glucosa_Id);
                foreach (var item in ListGlucoses)
                {
                    var oGlucoses = new Glucose();
                    oGlucoses.Date = item.ServiceDate.Value.ToString("dd-MM-yyyy");
                    oGlucoses.y = item.Value1;

                    Glucoses.Add(oGlucoses);
                }
                oIndicators.Glucoses = Glucoses;
                #endregion

                #region Haemoglobin
                var Haemoglobins = new List<Haemoglobin>();
                var ListHaemoglobins = serviceComponentFieldValues.FindAll(p => p.ComponentFieldId == Constants.HEMOGLOBINA_Hemoglobina_Id || p.ComponentFieldId == Constants.HEMOGRAMA_Hemoglobina_Id);
                foreach (var item in ListHaemoglobins)
                {
                    var oHaemoglobin = new Haemoglobin();
                    oHaemoglobin.Date = item.ServiceDate.Value.ToString("dd-MM-yyyy");
                    oHaemoglobin.y = item.Value1;

                    Haemoglobins.Add(oHaemoglobin);
                }
                oIndicators.Haemoglobins = Haemoglobins;
                #endregion

                #region Espiro

                var Espiros = new List<Espiro>();
                var ListEspiros = serviceComponentFieldValues.FindAll(p => p.ComponentFieldId == Constants.ESPIROMETRIA_Cvf_Id);
                foreach (var item in ListEspiros)
                {
                    var oEspiro = new Espiro();
                    oEspiro.Date = item.ServiceDate.Value.ToString("dd-MM-yyyy");
                    oEspiro.y = item.Value1;

                    Espiros.Add(oEspiro);
                }
                oIndicators.Espiros = Espiros;
                #endregion



                return oIndicators;
            }
            catch (Exception ex)
            {

                throw;
            }

        }

        public int Test()
        {
            try
            {
                int totalRecords = 0;
                for (int i = 0; i < 8000; i++)
                {
                    var preList = (from a in ctx.ServiceComponentFieldValues
                                   select new Patients
                                   {
                                       PatientId = a.v_ServiceComponentFieldValuesId,

                                   }).ToList();

                    totalRecords = preList.Count;
                }
                return totalRecords;

            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public int Test2()
        {
            try
            {
                int totalRecords = 0;
                for (int i = 0; i < 5; i++)
                {
                    var preList = (from a in ctx.Diseases
                                   select new Patients
                                   {
                                       PatientId = a.v_DiseasesId,

                                   }).ToList();

                    totalRecords = preList.Count;
                }
                return totalRecords;

            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public MonthlyControls MonthlyControls()
        {
            var currentDate = DateTime.Today;
            var firstDay = new DateTime(currentDate.Year, currentDate.Month, 1);
            var lastDay = new DateTime(currentDate.Year, currentDate.Month + 1, 1).AddDays(-1);

            var services = (from A in ctx.Service
                            join B in ctx.Protocol on A.v_ProtocolId equals B.v_ProtocolId
                            where (A.d_ServiceDate >= firstDay && A.d_ServiceDate <= lastDay)
                                    && A.i_IsDeleted == 0 && A.i_MasterServiceId == (int)masterService.Control
                            select new
                            {
                                ServiceDate = A.d_ServiceDate,
                                StatusControl = A.i_ServiceStatusId,
                                IsControl = A.i_IsControl
                            }).ToList().OrderBy(o => o.ServiceDate);

            var oMonthlyControls = new MonthlyControls();
            oMonthlyControls.Date = currentDate.Date.Month.ToString();

            var listDays = new List<Day>();
            var listControlDay = new List<ControlDay>();
            var listControlDayCompleted = new List<ControlCompletedDay>();

            for (int i = 1; i <= lastDay.Day; i++)
            {
                #region Days
                var oDay = new Day();
                var fecha = new DateTime(currentDate.Year, currentDate.Month, i);
                oDay.NroDay = fecha.ToString("ddd", new System.Globalization.CultureInfo("es-ES")) + "-" + i;
                listDays.Add(oDay);
                oMonthlyControls.NroDays = listDays;
                #endregion
                #region Controles
                var ControlsDay = services.ToList().FindAll(p => p.ServiceDate.Value.Day == i);

                var oControlDay = new ControlDay();
                oControlDay.Date = new DateTime(currentDate.Year, currentDate.Month, i).ToString();
                oControlDay.y = ControlsDay.Count().ToString();
                listControlDay.Add(oControlDay);

                oMonthlyControls.DailyControls = listControlDay;
                #endregion

                #region Controles Completados
                var ControlsDayCompleted = services.ToList().FindAll(p => p.ServiceDate.Value.Day == i && p.StatusControl == (int)ServiceStatus.Culminado);

                var oControlCompletedDay = new ControlCompletedDay();
                oControlCompletedDay.Date = new DateTime(currentDate.Year, currentDate.Month, i).ToString();
                oControlCompletedDay.y = ControlsDayCompleted.Count().ToString();
                listControlDayCompleted.Add(oControlCompletedDay);

                oMonthlyControls.DailyControlsCompleted = listControlDayCompleted;
                #endregion

            }
            return oMonthlyControls;

        }

        public List<ReviewEMO> ReviewsEMOs(string patientId)
        {
            try
            {
                var isDeleted = (int)Enumeratores.SiNo.No;
                var list = (from a in ctx.Service
                            join b in ctx.SystemParameter on new { a = a.i_AptitudeStatusId.Value, b = 124 } equals new { a = b.i_ParameterId, b = b.i_GroupId }
                            where a.i_IsDeleted == isDeleted
                            && a.v_PersonId == patientId
                            select new ReviewEMO
                            {
                                PatientId = a.v_PersonId,
                                ServiceId = a.v_ServiceId,
                                Aptitude = b.v_Value1,
                                ServiceDate = a.d_ServiceDate.Value,
                                IsRevisedHistoryId = a.i_IsRevisedHistoryId.Value,
                                MasterServiceId = a.i_MasterServiceId.Value,
                            }).ToList();

                var result = (from A in list
                              select new ReviewEMO
                              {
                                  PatientId = A.PatientId,
                                  ServiceId = A.ServiceId,
                                  Aptitude = A.Aptitude,
                                  ServiceDate = A.ServiceDate,
                                  IsRevisedHistoryId = A.IsRevisedHistoryId == null ? 0 : 1,
                                  MasterServiceId = A.MasterServiceId,
                                  DiseaseName = ConcatenateDxForServiceAntecedent(A.ServiceId),
                              }).OrderByDescending(p => p.ServiceDate).ToList();

                return result;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public MemoryStream DownloadFile(string patientId, string directorioESO)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(patientId))
                    throw new Exception();

                string PatientId = patientId;

                string path = string.Format("{0}{1}.pdf", directorioESO, PatientId);
                byte[] binaryData;
                FileStream inFile = new FileStream(path, FileMode.Open, FileAccess.Read);
                binaryData = new Byte[inFile.Length];
                inFile.Read(binaryData, 0, (int)inFile.Length);

                MemoryStream ms = new MemoryStream(binaryData);
                return ms;
            }
            catch (Exception ex)
            {

                throw;
            }
        }
        private string ConcatenateDxForServiceAntecedent(string serviceId)
        {
            var qry = (from A in ctx.DiagnosticRepository
                       join B in ctx.Diseases on A.v_DiseasesId equals B.v_DiseasesId
                       where A.v_ServiceId == serviceId &&
                       A.i_IsDeleted == 0
                       select new
                       {
                           v_DiseasesName = B.v_Name
                       }).ToList();

            return string.Join(", ", qry.Select(p => p.v_DiseasesName));
        }

        public List<PersonMedicalHistoryList> GetAntecedentConsolidateForService(string patientId)
        {
            //mon.IsActive = true;

            try
            {
                List<PersonMedicalHistoryList> lis = new List<PersonMedicalHistoryList>();

                int isDeleted = (int)SiNo.No;

                #region querys individuales

                // Obtener todos loa antecedentes de una persona (una o varias empresas)
                var historyId = (from a in ctx.History
                                 where a.v_PersonId == patientId && a.i_IsDeleted == isDeleted
                                 select new PersonMedicalHistoryList
                                 {
                                     v_AntecedentTypeName = "Ocupacionales",
                                     v_DiseasesName = null,
                                     v_HistoryId = a.v_HistoryId,
                                     d_StartDate = a.d_StartDate,
                                     d_EndDate = a.d_EndDate,
                                     v_Occupation = a.v_workstation,
                                     v_GroupName = null
                                 }).ToList();

                // personmedicalhistory
                var q1tmp = (from A in ctx.PersonMedicalHistory
                             join D in ctx.Diseases on A.v_DiseasesId equals D.v_DiseasesId
                             where A.i_IsDeleted == isDeleted && A.v_PersonId == patientId

                             select new PersonMedicalHistoryList
                             {
                                 v_AntecedentTypeName = "Medicos-Personales",
                                 v_DiseasesName = D.v_Name,
                                 d_StartDate = A.d_StartDate,
                                 v_GroupName = null

                             }).ToList();

                var q1 = (from A in q1tmp
                          select new PersonMedicalHistoryList
                          {
                              v_AntecedentTypeName = "Medicos-Personales",
                              v_DiseasesName = A.v_DiseasesName,
                              v_DateOrGroup = A.d_StartDate.Value.ToShortDateString(),
                              d_StartDate = A.d_StartDate.Value
                          }).ToList();

                // typeofeep
                var q2 = (from A in historyId
                          select new PersonMedicalHistoryList
                          {
                              v_AntecedentTypeName = "Ocupacionales, " + A.v_Occupation,
                              v_DiseasesName = ConcatenateTypeOfeep(A.v_HistoryId),
                              v_DateOrGroup = A.d_StartDate.Value.ToString("MM/yyyy") + " - " + A.d_EndDate.Value.ToString("MM/yyyy"),
                              d_StartDate = A.d_StartDate,
                          }).ToList();

                // workstationdangers
                var q3 = (from A in historyId
                          select new PersonMedicalHistoryList
                          {
                              v_AntecedentTypeName = "Ocupacionales, " + A.v_Occupation,
                              v_DiseasesName = ConcatenateWorkStationDangers(A.v_HistoryId),
                              v_DateOrGroup = A.d_StartDate.Value.ToString("MM/yyyy") + " - " + A.d_EndDate.Value.ToString("MM/yyyy"),
                              d_StartDate = A.d_StartDate,
                          }).ToList();

                // noxioushabits
                var q4 = (from A in ctx.NoxiousHabits
                          join B in ctx.SystemParameter on new { a = A.i_TypeHabitsId.Value, b = 148 }  // HÁBITOS NOCIVOS
                                                         equals new { a = B.i_ParameterId, b = B.i_GroupId } into B_join
                          from B in B_join.DefaultIfEmpty()
                          where A.i_IsDeleted == 0 && A.v_PersonId == patientId
                          select new PersonMedicalHistoryList
                          {
                              v_AntecedentTypeName = "Hábitos Nocivos",
                              v_DiseasesName = B.v_Value1 + ", " + A.v_Frequency,
                          }).ToList();

                // familymedicalantecedents

                var q5tmp = (from A in ctx.FamilyMedicalAntecedents
                             join B in ctx.SystemParameter on new { a = A.i_TypeFamilyId.Value, b = 149 }  // ANTECEDENTES FAMILIARES MÉDICOS
                                                            equals new { a = B.i_ParameterId, b = B.i_GroupId } into B_join
                             from B in B_join.DefaultIfEmpty()
                             join C in ctx.SystemParameter on new { a = B.i_ParentParameterId.Value, b = 149 }
                                                          equals new { a = C.i_ParameterId, b = C.i_GroupId } into C_join
                             from C in C_join.DefaultIfEmpty()
                             where A.i_IsDeleted == 0 && A.v_PersonId == patientId
                             group C by new { C.i_ParameterId, C.v_Value1 } into g
                             select new PersonMedicalHistoryList
                             {
                                 v_AntecedentTypeName = "Familiares",
                                 i_TypeFamilyId = g.Key.i_ParameterId,
                                 v_TypeFamilyName = g.Key.v_Value1
                             }).ToList();

                var q5 = (from A in q5tmp
                          select new PersonMedicalHistoryList
                          {
                              v_AntecedentTypeName = A.v_AntecedentTypeName,
                              v_DiseasesName = ConcatenateFamilyMedicalAntecedents(patientId, A.i_TypeFamilyId),
                              v_DateOrGroup = A.v_TypeFamilyName
                          }).ToList();

                #endregion

                #region Fusion

                if (q1.Count > 0)
                    lis.AddRange(q1);
                if (q2.Count > 0)
                    lis.AddRange(q2);
                if (q3.Count > 0)
                    lis.AddRange(q3);
                if (q4.Count > 0)
                    lis.AddRange(q4);
                if (q5.Count > 0)
                    lis.AddRange(q5);

                #endregion

                return lis.OrderBy(x => x.v_AntecedentTypeName).ToList();


            }
            catch (Exception ex)
            {
                return null;
            }
        }

        private string ConcatenateTypeOfeep(string pstrHistoryId)
        {
            var qry = (from A in ctx.TypeOfEpp
                       join B in ctx.SystemParameter on new { a = A.i_TypeofEEPId.Value, b = 146 }  // TIPO DE EPP USADO
                                                            equals new { a = B.i_ParameterId, b = B.i_GroupId }
                       where A.v_HistoryId == pstrHistoryId &&
                       A.i_IsDeleted == 0
                       select new
                       {
                           v_DiseasesName = B.v_Value1
                       }).ToList();

            return qry.Count == 0 ? "No usa EPP" : string.Join(", ", qry.Select(p => p.v_DiseasesName));
        }

        private string ConcatenateWorkStationDangers(string pstrHistoryId)
        {
            var qry = (from A in ctx.WorkStationDangers
                       join B in ctx.SystemParameter on new { a = A.i_DangerId.Value, b = 145 } // PELIGROS EN EL PUESTO
                                                              equals new { a = B.i_ParameterId, b = B.i_GroupId }
                       where A.v_HistoryId == pstrHistoryId &&
                       A.i_IsDeleted == 0
                       select new
                       {
                           v_DiseasesName = B.v_Value1
                       }).ToList();

            return qry.Count == 0 ? "No refiere peligros en el puesto" : string.Join(", ", qry.Select(p => p.v_DiseasesName));
        }

        private string ConcatenateFamilyMedicalAntecedents(string pstrPersonId, int pintTypeFamilyId)
        {
            var qry = (from A in ctx.FamilyMedicalAntecedents
                       join B in ctx.SystemParameter on new { a = A.i_TypeFamilyId.Value, b = 149 }  // ANTECEDENTES FAMILIARES MÉDICOS
                                                    equals new { a = B.i_ParameterId, b = B.i_GroupId } into B_join
                       from B in B_join.DefaultIfEmpty()
                       join C in ctx.SystemParameter on new { a = B.i_ParentParameterId.Value, b = 149 }  // [PADRE,MADRE,HERMANOS]
                                                      equals new { a = C.i_ParameterId, b = C.i_GroupId } into C_join
                       from C in C_join.DefaultIfEmpty()
                       join D in ctx.Diseases on new { a = A.v_DiseasesId }
                                                               equals new { a = D.v_DiseasesId } into D_join
                       from D in D_join.DefaultIfEmpty()
                       where A.v_PersonId == pstrPersonId &&
                       A.i_IsDeleted == 0 && C.i_ParameterId == pintTypeFamilyId
                       select new
                       {
                           v_DiseasesName = D.v_Name
                       }).ToList();

            return string.Join(", ", qry.Select(p => p.v_DiseasesName));
        }

        public bool RevisedStatusEMO(string serviceId, bool status)
        {
            try
            {
                var objEntitySource = (from a in ctx.Service                                      
                                       where a.v_ServiceId == serviceId
                                       select a).FirstOrDefault();

                objEntitySource.i_IsRevisedHistoryId = status == true ? 1 : 0;

                ctx.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
                throw;
            }

        }

        public List<string> GetNamePatients(string value)
        {
            try
            {
                var isDeleted = (int)Enumeratores.SiNo.No;
                var list = (from a in ctx.Pacient
                            join b in ctx.Person on a.v_PersonId equals b.v_PersonId
                            where a.i_IsDeleted == isDeleted && (b.v_FirstName.Contains(value) 
                            || b.v_FirstLastName.Contains(value) || b.v_SecondLastName.Contains(value)) && a.v_PersonId == b.v_PersonId
                            select new
                            {
                                Name = b.v_FirstName + " " + b.v_FirstLastName + " " + b.v_SecondLastName,
                            }).ToList();
                return list.Select(x => x.Name).ToList();
            }
            catch (Exception ex)
            {

                throw;
            }
        }

    }
}
