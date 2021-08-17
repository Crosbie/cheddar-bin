USE [Glanbia_Ireland_Cheese]
GO
/****** Object:  StoredProcedure [dbo].[SP_ACE_SCAN_ITEM]    Script Date: 05/24/2010 14:36:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_UPLOAD_PHASE_3] AS

  DECLARE @Block_ID uniqueidentifier
         ,@Prod_Date date
         ,@Prod_Time time(7)
         ,@Plant_Code char(1)
         ,@Year_Code char(1)
         ,@Day_Number NUMERIC(3,0)
         ,@lv_count INT
         ,@DeclareDayCodesCursor NVARCHAR(4000)
         ,@Last_Pallet NUMERIC(18,0)
         ,@Last_Block NUMERIC(18,0)
         ,@Daycode_start_hour NUMERIC(2,0)
         ,@blocks_per_pallet NUMERIC(3,0)
         ,@insert_day_code CHAR(1)

  SELECT @Daycode_start_hour = CAST(cp_value AS NUMERIC(2,0)) FROM Cheese_Parameters WHERE cp_key = 'DAYCODE_START_HOUR'
  SELECT @blocks_per_pallet  = CAST(cp_value AS NUMERIC(3,0)) FROM Cheese_Parameters WHERE cp_key = 'BLOCKS_PER_PALLET'
  IF @Daycode_start_hour IS NULL SELECT @Daycode_start_hour = 13
  IF @blocks_per_pallet  IS NULL SELECT @blocks_per_pallet  = 50

  DECLARE lc_cbl CURSOR STATIC FOR
  SELECT cb_id, cb_prod_date, cb_prod_time, cb_plant_code
  FROM   [Cheese_Blocks]
  WHERE  cb_year_code IS NULL
  ORDER  BY cb_prod_date, cb_prod_time

  OPEN lc_cbl
  WHILE 1=1
  BEGIN

    FETCH lc_cbl INTO @Block_ID, @Prod_Date, @Prod_Time, @Plant_Code
--    PRINT @block_id

    IF @@fetch_status <> 0 BREAK

    SELECT @Year_Code = yc_code FROM Year_Codes WHERE yc_year = Year(@Prod_Date)
--    print @Year_Code

    IF DATEPART(HOUR, @Prod_Time) > @Daycode_start_hour
      SELECT @Day_Number = datepart(dayofyear, @Prod_Date)
    ELSE
      SELECT @Day_Number = datepart(dayofyear, DATEADD(day,-1,@Prod_Date))
--    print @Day_Number

    SELECT @DeclareDayCodesCursor = 'DECLARE DayCodesCursor CURSOR READ_ONLY FORWARD_ONLY FOR ' +
                                    'SELECT dc_last_pallet, dc_last_block ' +
                                    'FROM   Day_Codes ' +
                                    'WHERE  dc_year_code = ''' + @Year_Code + ''' ' +
                                    'AND    dc_plant_code = ''' + @Plant_Code + ''' ' +
                                    'AND    dc_day_number = ' + CAST(@Day_Number AS NVARCHAR(3)) + 
                                    'ORDER  BY dc_year_code '
--    print @DeclareDayCodesCursor
    EXEC(@DeclareDayCodesCursor)
    OPEN DayCodesCursor
    FETCH NEXT FROM DayCodesCursor INTO @Last_Pallet, @Last_Block
--    print concat(@Last_Pallet, ', ', @Last_Block)
    CLOSE DayCodesCursor
    DEALLOCATE DayCodesCursor

    IF @Last_Pallet IS NULL
      BEGIN
        SELECT @Last_Pallet = 1
        SELECT @Last_Block  = 0
        SELECT @insert_day_code = 'Y'
      END
    ELSE
        SELECT @insert_day_code = 'N'
    IF @Last_Block >= @blocks_per_pallet
      BEGIN
        SELECT @Last_Pallet = @Last_Pallet + 1
        SELECT @Last_Block  = 1
      END
    ELSE
      BEGIN
        SELECT @Last_Block = @Last_Block + 1
      END
--    print CONCAT(@Last_Pallet, ', ', @Last_Block)

    IF @insert_day_code = 'Y'
      INSERT INTO [Day_Codes] (
        dc_year_code,
        dc_plant_code,
        dc_day_number,
        dc_last_pallet,
        dc_last_block)
      VALUES (
        @Year_Code,
        @Plant_Code,
        @Day_Number,
        @Last_Pallet,
        @Last_Block)
    ELSE
      UPDATE [Day_Codes]
      SET    dc_last_pallet = @Last_Pallet,
             dc_last_block  = @Last_Block
      WHERE  dc_year_code   = @Year_Code
      AND    dc_plant_code  = @Plant_Code
      AND    dc_day_number  = @Day_Number

    UPDATE [Cheese_Blocks]
    SET    cb_pallet     = @Last_Pallet,
           cb_block      = @Last_Block,
           cb_year_code  = @Year_Code,
           cb_day_number = @Day_Number
    WHERE  cb_id         = @Block_ID

  END

  CLOSE lc_cbl
  DEALLOCATE lc_cbl
