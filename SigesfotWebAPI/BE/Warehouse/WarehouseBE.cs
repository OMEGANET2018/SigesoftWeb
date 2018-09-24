﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE.Warehouse
{
    public class WarehouseBE
    {
        [Key]
        public string WarehouseId { get; set; }

        public string OrganizationId { get; set; }
        public string LocationId { get; set; }
        public string Name { get; set; }
        public string AdditionalInformation { get; set; }
        public int? CostCenterId { get; set; }
        public int? IsDeleted { get; set; }
        public int? InsertUserId { get; set; }
        public DateTime? InsertDate { get; set; }
        public int? UpdateUserId { get; set; }
        public DateTime? UpdateDate { get; set; }
    }
}