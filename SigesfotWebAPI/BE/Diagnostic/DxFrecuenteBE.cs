﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE.Diagnostic
{
    public class DxFrecuenteBE
    {
        [Key]
        public string DxFrecuenteId { get; set; }

        public string DiseasesId { get; set; }
        public string CIE10Id { get; set; }
        public int? IsDeleted { get; set; }
        public int? InsertUserId { get; set; }
        public DateTime? InsertDate { get; set; }
        public int? UpdateUserId { get; set; }
        public DateTime? UpdateDate { get; set; }
    }
}
