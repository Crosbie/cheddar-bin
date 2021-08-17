USE [Glanbia_Ireland_Cheese]
GO
/****** Object:  StoredProcedure [dbo].[SP_ACE_SCAN_ITEM]    Script Date: 05/24/2010 14:36:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_UPLOAD_PHASE_2] 

  @plant_code   CHAR(1),
  @prod_date    NVARCHAR(20),
  @prod_time    NVARCHAR(20),
  @upload_dir   NVARCHAR(200),
  @upload_file  NVARCHAR(200),
  @pass_fail    CHAR(1),
  @block_image  IMAGE

AS

  DECLARE @cb_id UNIQUEIDENTIFIER

  SELECT @cb_id = cb_id FROM Cheese_Blocks WHERE cb_prod_date = @prod_date AND cb_prod_time = @prod_time

  IF @cb_id IS NULL
    INSERT INTO Cheese_Blocks (
      cb_plant_code,
      cb_prod_date,
      cb_prod_time,
      cb_upload_date,
      cb_upload_time,
      cb_upload_dir,
      cb_upload_file,
      cb_pass_fail,
      cb_block_image)
    VALUES (
      @plant_code ,
      CONVERT(DATE,@prod_date,112),
      CONVERT(TIME,@prod_time,108),
      GETDATE(),
      GETDATE(),
      @upload_dir ,
      @upload_file,
      @pass_fail  ,
      @block_image)
