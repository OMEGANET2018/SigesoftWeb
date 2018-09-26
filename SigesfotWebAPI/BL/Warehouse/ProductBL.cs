﻿
using BE.Common;
using BE.Warehouse;
using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL.Warehouse
{
    public class ProductBL
    {
        private DatabaseContext ctx = new DatabaseContext();

        #region Bussines
        public BoardProduct GetAllProducts(BoardProduct data)
        {
            try
            {
                var isDeleted = (int)Enumeratores.SiNo.No;
                int skip = (data.Index - 1) * data.Take;

                //filters
                string filterProductCode = string.IsNullOrWhiteSpace(data.ProductCode) ? "" : data.ProductCode;
                string filterName = string.IsNullOrWhiteSpace(data.Name) ? "" : data.Name;

                var list = (from a in ctx.Product
                            join b in ctx.Product on a.v_ProductId equals b.v_ProductId
                            where a.i_IsDeleted == isDeleted && (b.v_ProductCode.Contains(filterProductCode))
                                    && (b.v_Name.Contains(filterName))
                            select new Products
                            {
                                ProductId = a.v_ProductId,
                                Name = a.v_Name,
                                ProductCode = a.v_ProductCode,                             
                                Presentation = a.v_Presentation,

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

        public Products GetProductById(string productId)
        {
            try
            {
                var isDeleted = (int)Enumeratores.SiNo.No;

                var data = (from a in ctx.Product
                            where a.i_IsDeleted == isDeleted && a.v_ProductId == productId
                            select new Products()
                            {
                                ProductId = a.v_ProductId,
                                ProductCode = a.v_ProductCode,
                                CategoryId = a.i_CategoryId,
                                Name = a.v_Name,
                                GenericName = a.v_GenericName,
                                BarCode = a.v_BarCode,
                                Brand = a.v_Brand,
                                Model = a.v_Model,
                                SerialNumber = a.v_SerialNumber,
                                ExpirationDate = a.d_ExpirationDate,
                                MeasurementUnitId = a.i_MeasurementUnitId,
                                ReferentialCostPrice = a.r_ReferentialCostPrice,
                                ReferentialSalesPrice = a.r_ReferentialSalesPrice,
                                Presentation = a.v_Presentation,
                                AdditionalInformation = a.v_AdditionalInformation,
                                Image = a.b_Image,
                            }).FirstOrDefault();

                return data;
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public bool AddProducts(Products product, int systemUserId)
        {
            ProductBL oProductBL = new ProductBL();
            try
            {
                var oProductBE = new ProductBE
                {
                    i_CategoryId = product.CategoryId,
                    v_Name = product.Name,
                    v_GenericName = product.GenericName,
                    v_BarCode = product.BarCode,
                    v_ProductCode = product.ProductCode,
                    v_Brand = product.Brand,
                    v_Model = product.Model,
                    v_SerialNumber = product.SerialNumber,
                    d_ExpirationDate = product.ExpirationDate,
                    i_MeasurementUnitId = product.MeasurementUnitId,
                    r_ReferentialCostPrice = product.ReferentialCostPrice,
                    r_ReferentialSalesPrice = product.ReferentialSalesPrice,
                    v_Presentation = product.Presentation,
                    v_AdditionalInformation = product.AdditionalInformation,
                    b_Image = product.Image,
                };
                var productId = oProductBL.AddProduct(oProductBE, systemUserId);
                //aaa
                if (productId != "")
                {
                    var oProduct = new ProductBE
                    {
                        v_ProductId = productId,
                        i_IsDeleted = (int)Enumeratores.SiNo.No,
                        d_InsertDate = DateTime.UtcNow,
                        i_InsertUserId = systemUserId
                    };


                    ctx.Product.Add(oProduct);

                    int rows = ctx.SaveChanges();

                    if (rows > 0)
                        return true;

                    return false;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {

                throw;
            }

        }

        public bool EditProduct(Products product, int systemUserId)
        {
            ProductBL oProductBL = new ProductBL();
            try
            {
                var oProduct = (from a in ctx.Product where a.v_ProductId == product.ProductId select a).FirstOrDefault();
                if (oProduct == null)
                    return false;
                oProduct.i_CategoryId = product.CategoryId;
                oProduct.v_Name = product.Name;
                oProduct.v_GenericName = product.GenericName;
                oProduct.v_BarCode = product.BarCode;
                oProduct.v_ProductCode = product.ProductCode;
                oProduct.v_Brand = product.Brand;
                oProduct.v_Model = product.Model;
                oProduct.v_SerialNumber = product.SerialNumber;
                oProduct.d_ExpirationDate = product.ExpirationDate;
                oProduct.i_MeasurementUnitId = product.MeasurementUnitId;
                oProduct.r_ReferentialCostPrice = product.ReferentialCostPrice;
                oProduct.r_ReferentialSalesPrice = product.ReferentialSalesPrice;
                oProduct.v_Presentation = product.Presentation;
                oProduct.v_AdditionalInformation = product.AdditionalInformation;
                oProduct.b_Image = product.Image;

                return oProductBL.UpdateProduct(oProduct, systemUserId);
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool DeleteProduct(string productId, int systemUserId)
        {
            try
            {
                var isDeleted = (int)Enumeratores.SiNo.No;
                var product = (from a in ctx.Product where a.v_ProductId == productId && a.i_IsDeleted == isDeleted select a).FirstOrDefault();

                product.i_UpdateUserId = systemUserId;
                product.d_UpdateDate = DateTime.UtcNow;
                product.i_IsDeleted = (int)Enumeratores.SiNo.Si;

                int rows = ctx.SaveChanges();

                return rows > 0;
            }
            catch (Exception e)
            {
                return false;
            }
        }
        #endregion



        #region CRUD
        public ProductBE GetProduct(string productId)
        {
            try
            {
                var objEntity = (from a in ctx.Product
                                 where a.v_ProductId == productId
                                 select a).FirstOrDefault();

                return objEntity;

            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public List<ProductBE> GetAllProduct()
        {
            try
            {
                var isDelete = (int)Enumeratores.SiNo.No;
                var objEntity = (from a in ctx.Product
                                 where a.i_IsDeleted == isDelete
                                 select new ProductBE()
                                 {
                                     v_ProductId = a.v_ProductId,
                                     i_CategoryId = a.i_CategoryId,
                                     v_Name = a.v_Name,
                                     v_GenericName = a.v_GenericName,
                                     v_BarCode = a.v_BarCode,
                                     v_ProductCode = a.v_ProductCode,
                                     v_Brand = a.v_Brand,
                                     v_Model = a.v_Model,
                                     v_SerialNumber = a.v_SerialNumber,
                                     d_ExpirationDate = a.d_ExpirationDate,
                                     i_MeasurementUnitId = a.i_MeasurementUnitId,
                                     r_ReferentialCostPrice = a.r_ReferentialCostPrice,
                                     r_ReferentialSalesPrice = a.r_ReferentialSalesPrice,
                                     v_Presentation = a.v_Presentation,
                                     v_AdditionalInformation = a.v_AdditionalInformation,
                                     b_Image = a.b_Image,
                                     i_IsDeleted = a.i_IsDeleted,
                                     i_InsertUserId = a.i_InsertUserId,
                                     d_InsertDate = a.d_InsertDate,
                                     d_UpdateDate = a.d_UpdateDate,
                                     i_UpdateUserId = a.i_UpdateUserId
                                 }).ToList();

                return objEntity;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        
        public string AddProduct(ProductBE product, int systemUserId)
        {
            try
            {
                ProductBE oProductBE = new ProductBE()
                {
                    v_ProductId = new Warehouse.ProductBL().GetPrimaryKey(1, 6, "PI"),
                    i_CategoryId = product.i_CategoryId,
                    v_Name = product.v_Name,
                    v_GenericName = product.v_GenericName,
                    v_BarCode = product.v_BarCode,
                    v_ProductCode = product.v_ProductCode,
                    v_Brand = product.v_Brand,
                    v_Model = product.v_Model,
                    v_SerialNumber = product.v_SerialNumber,
                    d_ExpirationDate = product.d_ExpirationDate,
                    i_MeasurementUnitId = product.i_MeasurementUnitId,
                    r_ReferentialCostPrice = product.r_ReferentialCostPrice,
                    r_ReferentialSalesPrice = product.r_ReferentialSalesPrice,
                    v_Presentation = product.v_Presentation,
                    v_AdditionalInformation = product.v_AdditionalInformation,
                    b_Image = product.b_Image,

                    //Auditoria
                    i_IsDeleted = (int)Enumeratores.SiNo.No,
                    d_InsertDate = DateTime.UtcNow,
                    i_InsertUserId = systemUserId,
                };

                ctx.Product.Add(oProductBE);

                int rows = ctx.SaveChanges();
                if(rows > 0)
                return oProductBE.v_ProductId;

                return "";
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    
        public bool UpdateProduct(ProductBE product, int systemUserId)
        {
            try
            {
                var oProduct = (from a in ctx.Product
                            where a.v_ProductId == product.v_ProductId
                                select a).FirstOrDefault();

                if (oProduct == null)
                    return false;

                oProduct.i_CategoryId = product.i_CategoryId;
                oProduct.v_Name = product.v_Name;
                oProduct.v_GenericName = product.v_GenericName;
                oProduct.v_BarCode = product.v_BarCode;
                oProduct.v_ProductCode = product.v_ProductCode;
                oProduct.v_Brand = product.v_Brand;
                oProduct.v_Model = product.v_Model;
                oProduct.v_SerialNumber = product.v_SerialNumber;
                oProduct.d_ExpirationDate = product.d_ExpirationDate;
                oProduct.i_MeasurementUnitId = product.i_MeasurementUnitId;
                oProduct.r_ReferentialCostPrice = product.r_ReferentialCostPrice;
                oProduct.r_ReferentialSalesPrice = product.r_ReferentialSalesPrice;
                oProduct.v_Presentation = product.v_Presentation;
                oProduct.v_AdditionalInformation = product.v_AdditionalInformation;
                oProduct.b_Image = product.b_Image;

                //Auditoria

                oProduct.d_UpdateDate = DateTime.UtcNow;
                oProduct.i_UpdateUserId = systemUserId;

                int rows = ctx.SaveChanges();

                return rows > 0;
            }
            catch (Exception ex)
            {
                return false;
            }
        }


        #endregion
        #region Bussines Logic

        public string GetPrimaryKey(int nodeId, int tableId, string pre)
        {
            var secuentialId = GetNextSecuentialId(nodeId, tableId);
            return string.Format("N{0}-{1}{2}", nodeId.ToString("000"), pre, secuentialId.ToString("000000000"));
        }

        public int GetNextSecuentialId(int pintNodeId, int pintTableId)
        {

            var objSecuential = (from a in ctx.Secuential
                                 where a.i_TableId == pintTableId && a.i_NodeId == pintNodeId
                                 select a).SingleOrDefault();

            // Actualizar el campo con el nuevo valor a efectos de reservar el ID autogenerado para evitar colisiones entre otros nodos
            if (objSecuential != null)
            {
                objSecuential.i_SecuentialId = objSecuential.i_SecuentialId + 1;
            }
            else
            {
                objSecuential = new SecuentialBE();
                objSecuential.i_NodeId = pintNodeId;
                objSecuential.i_TableId = pintTableId;
                objSecuential.i_SecuentialId = 0;
                ctx.Secuential.Add(objSecuential);
            }

            return objSecuential.i_SecuentialId.Value;
        }
        #endregion
    }

}
