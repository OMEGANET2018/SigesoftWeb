﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE.Common
{
    public class PacientBE
    {
        public string PersonId { get; set; }
        public int IsDeleted { get; set; }
        public int InsertUserId { get; set; }
        public DateTime InsertDate { get; set; }
        public int UpdateUserId { get; set; }
        public DateTime UpdateDate { get; set; }
        public int UpdateNodeId { get; set; }
    }
}
