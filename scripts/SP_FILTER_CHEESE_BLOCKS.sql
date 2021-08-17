USE [Glanbia_Ireland_Cheese]
GO
/****** Object:  StoredProcedure [dbo].[SP_ACE_SCAN_ITEM]    Script Date: 05/24/2010 14:36:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_FILTER_CHEESE_BLOCKS] 

  @year_code_n  CHAR(1), @year_code_1  CHAR(1),      @year_code_2  CHAR(1),
  @plant_code_n CHAR(1), @plant_code_1 CHAR(1),      @plant_code_2 CHAR(1),
  @day_number_n CHAR(1), @day_number_1 NUMERIC(3,0), @day_number_2 NUMERIC(3,0),
  @pallet_n     CHAR(1), @pallet_1     INT,          @pallet_2     INT,
  @block_n      CHAR(1), @block_1      INT,          @block_2      INT,
  @prod_date_n  CHAR(1), @prod_date_1  DATE,         @prod_date_2  DATE,
  @prod_time_n  CHAR(1), @prod_time_1  TIME,         @prod_time_2  TIME,
  @pass_fail_n  CHAR(1), @pass_fail_1  CHAR(1),      @pass_fail_2  CHAR(1),
  @order_by     NVARCHAR(200)

AS

  DECLARE @lv_sql      NVARCHAR(4000),
          @lv_wildcard CHAR(1)

  SET @lv_sql = 'SELECT cb_year_code
 						           ,cb_plant_code
                       ,cb_day_number
                       ,cb_pallet
                       ,cb_block
                       ,cb_prod_date
                       ,cb_prod_time
                       ,cb_pass_fail
						    FROM    Cheese_Blocks
						    WHERE   cb_id = cb_id'

  IF CHARINDEX('%',@year_code_1) > 0
    SET @lv_wildcard = NULL
  ELSE
    SET @lv_wildcard = '%'

  IF @year_code_1 IS NOT NULL
    BEGIN
      IF @year_code_2 IS NOT NULL
        BEGIN
          IF @year_code_n = 'Y' 
            SELECT @lv_sql = CONCAT(@lv_sql,' AND UPPER(cb_year_code) NOT BETWEEN ''',UPPER(@year_code_1),''' AND ''',UPPER(@year_code_2),''' ')
          ELSE
            SELECT @lv_sql = CONCAT(@lv_sql,' AND UPPER(cb_year_code) BETWEEN ''',UPPER(@year_code_1),''' AND ''',UPPER(@year_code_2),''' ')
        END
      ELSE
        BEGIN
          IF @year_code_n = 'Y'
            SELECT @lv_sql = CONCAT(@lv_sql,' AND UPPER(cb_year_code) NOT LIKE ''',@lv_wildcard,UPPER(@year_code_1),@lv_wildcard,''' ')
          ELSE
            SELECT @lv_sql = CONCAT(@lv_sql,' AND UPPER(cb_year_code)  LIKE ''',@lv_wildcard,UPPER(@year_code_1),@lv_wildcard,''' ')
        END
    END
  ELSE
    BEGIN
      IF @year_code_2 IS NOT NULL
        BEGIN
          IF @year_code_n = 'Y'
            SELECT @lv_sql = CONCAT(@lv_sql,' AND UPPER(cb_year_code) NOT LIKE ''',@lv_wildcard,UPPER(@year_code_2),@lv_wildcard,''' ')
          ELSE
            SELECT @lv_sql = CONCAT(@lv_sql,' AND UPPER(cb_year_code)  LIKE ''',@lv_wildcard,UPPER(@year_code_2),@lv_wildcard,''' ')
        END
      ELSE
        BEGIN
          IF @year_code_n = 'Y'
            SELECT @lv_sql = CONCAT(@lv_sql,' AND cb_year_code IS NULL ')
        END
    END

  IF CHARINDEX('%',@plant_code_1) > 0
    SET @lv_wildcard = NULL
  ELSE
    SET @lv_wildcard = '%'

  IF @plant_code_1 IS NOT NULL
    BEGIN
      IF @plant_code_2 IS NOT NULL
        BEGIN
          IF @plant_code_n = 'Y' 
            SELECT @lv_sql = CONCAT(@lv_sql,' AND UPPER(cb_plant_code) NOT BETWEEN ''',UPPER(@plant_code_1),''' AND ''',UPPER(@plant_code_2),''' ')
          ELSE
            SELECT @lv_sql = CONCAT(@lv_sql,' AND UPPER(cb_plant_code) BETWEEN ''',UPPER(@plant_code_1),''' AND ''',UPPER(@plant_code_2),''' ')
        END
      ELSE
        BEGIN
          IF @plant_code_n = 'Y'
            SELECT @lv_sql = CONCAT(@lv_sql,' AND UPPER(cb_plant_code) NOT LIKE ''',@lv_wildcard,UPPER(@plant_code_1),@lv_wildcard,''' ')
          ELSE
            SELECT @lv_sql = CONCAT(@lv_sql,' AND UPPER(cb_plant_code)  LIKE ''',@lv_wildcard,UPPER(@plant_code_1),@lv_wildcard,''' ')
        END
    END
  ELSE
    BEGIN
      IF @plant_code_2 IS NOT NULL
        BEGIN
          IF @plant_code_n = 'Y'
            SELECT @lv_sql = CONCAT(@lv_sql,' AND UPPER(cb_plant_code) NOT LIKE ''',@lv_wildcard,UPPER(@plant_code_2),@lv_wildcard,''' ')
          ELSE
            SELECT @lv_sql = CONCAT(@lv_sql,' AND UPPER(cb_plant_code)  LIKE ''',@lv_wildcard,UPPER(@plant_code_2),@lv_wildcard,''' ')
        END
      ELSE
        BEGIN
          IF @plant_code_n = 'Y'
            SELECT @lv_sql = CONCAT(@lv_sql,' AND cb_plant_code IS NULL ')
        END
    END

  IF @day_number_1 IS NOT NULL
    BEGIN
      IF @day_number_2 IS NOT NULL
        BEGIN
          IF @day_number_n = 'Y' 
            SELECT @lv_sql = CONCAT(@lv_sql,' AND cb_day_number NOT BETWEEN ',@day_number_1,' AND ',@day_number_2,' ')
          ELSE
            SELECT @lv_sql = CONCAT(@lv_sql,' AND cb_day_number BETWEEN ',@day_number_1,' AND ',@day_number_2,' ')
        END
      ELSE
        BEGIN
          IF @day_number_n = 'Y'
            SELECT @lv_sql = CONCAT(@lv_sql,' AND cb_day_number <> ',@day_number_1,' ')
          ELSE
            SELECT @lv_sql = CONCAT(@lv_sql,' AND cb_day_number  = ',@day_number_1,' ')
        END
    END
  ELSE
    BEGIN
      IF @day_number_2 IS NOT NULL
        BEGIN
          IF @day_number_n = 'Y'
            SELECT @lv_sql = CONCAT(@lv_sql,' AND UPPER(cb_day_number) <> ',@day_number_2,' ')
          ELSE
            SELECT @lv_sql = CONCAT(@lv_sql,' AND UPPER(cb_day_number)  = ',@day_number_2,' ')
        END
      ELSE
        BEGIN
          IF @day_number_n = 'Y'
            SELECT @lv_sql = CONCAT(@lv_sql,' AND cb_day_number IS NULL ')
        END
    END

  IF @pallet_1 IS NOT NULL
    BEGIN
      IF @pallet_2 IS NOT NULL
        BEGIN
          IF @pallet_n = 'Y' 
            SELECT @lv_sql = CONCAT(@lv_sql,' AND cb_pallet NOT BETWEEN ',@pallet_1,' AND ',@pallet_2,' ')
          ELSE
            SELECT @lv_sql = CONCAT(@lv_sql,' AND cb_pallet BETWEEN ',@pallet_1,' AND ',@pallet_2,' ')
        END
      ELSE
        BEGIN
          IF @pallet_n = 'Y'
            SELECT @lv_sql = CONCAT(@lv_sql,' AND cb_pallet <> ',@pallet_1,' ')
          ELSE
            SELECT @lv_sql = CONCAT(@lv_sql,' AND cb_pallet  = ',@pallet_1,' ')
        END
    END
  ELSE
    BEGIN
      IF @pallet_2 IS NOT NULL
        BEGIN
          IF @pallet_n = 'Y'
            SELECT @lv_sql = CONCAT(@lv_sql,' AND UPPER(cb_pallet) <> ',@pallet_2,' ')
          ELSE
            SELECT @lv_sql = CONCAT(@lv_sql,' AND UPPER(cb_pallet)  = ',@pallet_2,' ')
        END
      ELSE
        BEGIN
          IF @pallet_n = 'Y'
            SELECT @lv_sql = CONCAT(@lv_sql,' AND cb_pallet IS NULL ')
        END
    END

  IF @block_1 IS NOT NULL
    BEGIN
      IF @block_2 IS NOT NULL
        BEGIN
          IF @block_n = 'Y' 
            SELECT @lv_sql = CONCAT(@lv_sql,' AND cb_block NOT BETWEEN ',@block_1,' AND ',@block_2,' ')
          ELSE
            SELECT @lv_sql = CONCAT(@lv_sql,' AND cb_block BETWEEN ',@block_1,' AND ',@block_2,' ')
        END
      ELSE
        BEGIN
          IF @block_n = 'Y'
            SELECT @lv_sql = CONCAT(@lv_sql,' AND cb_block <> ',@block_1,' ')
          ELSE
            SELECT @lv_sql = CONCAT(@lv_sql,' AND cb_block  = ',@block_1,' ')
        END
    END
  ELSE
    BEGIN
      IF @block_2 IS NOT NULL
        BEGIN
          IF @block_n = 'Y'
            SELECT @lv_sql = CONCAT(@lv_sql,' AND UPPER(cb_block) <> ',@block_2,' ')
          ELSE
            SELECT @lv_sql = CONCAT(@lv_sql,' AND UPPER(cb_block)  = ',@block_2,' ')
        END
      ELSE
        BEGIN
          IF @block_n = 'Y'
            SELECT @lv_sql = CONCAT(@lv_sql,' AND cb_block IS NULL ')
        END
    END

  IF @prod_date_1 IS NOT NULL
    BEGIN
      IF @prod_date_2 IS NOT NULL
        BEGIN
          IF @prod_date_n = 'Y'
            SELECT @lv_sql = CONCAT(@lv_sql,' AND CONVERT(VARCHAR,cb_prod_date,112) NOT BETWEEN ''',CONVERT(VARCHAR,@prod_date_1,112),''' AND ''',CONVERT(VARCHAR,@prod_date_2,112),''' ')
          ELSE
            SELECT @lv_sql = CONCAT(@lv_sql,' AND CONVERT(VARCHAR,cb_prod_date,112) BETWEEN ''',CONVERT(VARCHAR,@prod_date_1,112),''' AND ''',CONVERT(VARCHAR,@prod_date_2,112),''' ')
        END
      ELSE
        BEGIN
          IF @prod_date_n = 'Y'
            BEGIN
              SELECT @lv_sql = CONCAT(@lv_sql,' AND CONVERT(VARCHAR,cb_prod_date,112) <> ''',CONVERT(VARCHAR,@prod_date_1,112),''' ')
            END
          ELSE
            BEGIN
              SELECT @lv_sql = CONCAT(@lv_sql,' AND CONVERT(VARCHAR,cb_prod_date,112) = ''',CONVERT(VARCHAR,@prod_date_1,112),''' ')
            END
        END
    END
  ELSE
    IF @prod_date_2 IS NOT NULL
      BEGIN
        IF @prod_date_n = 'Y'
          BEGIN
            SELECT @lv_sql = CONCAT(@lv_sql,' AND CONVERT(VARCHAR,cb_prod_date,112) <> ''',CONVERT(VARCHAR,@prod_date_2,112),''' ')
          END
        ELSE
          BEGIN
            SELECT @lv_sql = CONCAT(@lv_sql,' AND CONVERT(VARCHAR,cb_prod_date,112)  = ''',CONVERT(VARCHAR,@prod_date_2,112),''' ')
          END
      END
    ELSE
      BEGIN
        IF @prod_date_n = 'Y'
          SELECT @lv_sql = CONCAT(@lv_sql,' AND cb_prod_date IS NULL ')
      END

  IF @prod_time_1 IS NOT NULL
    BEGIN
      IF @prod_time_2 IS NOT NULL
        BEGIN
          IF @prod_time_n = 'Y'
            SELECT @lv_sql = CONCAT(@lv_sql,' AND CONVERT(VARCHAR,cb_prod_time,108) NOT BETWEEN ''',CONVERT(VARCHAR,@prod_time_1,108),''' AND ''',CONVERT(VARCHAR,@prod_time_2,108),''' ')
          ELSE
            SELECT @lv_sql = CONCAT(@lv_sql,' AND CONVERT(VARCHAR,cb_prod_time,108) BETWEEN ''',CONVERT(VARCHAR,@prod_time_1,108),''' AND ''',CONVERT(VARCHAR,@prod_time_2,108),''' ')
        END
      ELSE
        BEGIN
          IF @prod_time_n = 'Y'
            BEGIN
              SELECT @lv_sql = CONCAT(@lv_sql,' AND CONVERT(VARCHAR,cb_prod_time,108) <> ''',CONVERT(VARCHAR,@prod_time_1,108),''' ')
            END
          ELSE
            BEGIN
              SELECT @lv_sql = CONCAT(@lv_sql,' AND CONVERT(VARCHAR,cb_prod_time,108) = ''',CONVERT(VARCHAR,@prod_time_1,108),''' ')
            END
        END
    END
  ELSE
    IF @prod_time_2 IS NOT NULL
      BEGIN
        IF @prod_time_n = 'Y'
          BEGIN
            SELECT @lv_sql = CONCAT(@lv_sql,' AND CONVERT(VARCHAR,cb_prod_time,108) <> ''',CONVERT(VARCHAR,@prod_time_2,108),''' ')
          END
        ELSE
          BEGIN
            SELECT @lv_sql = CONCAT(@lv_sql,' AND CONVERT(VARCHAR,cb_prod_time,108)  = ''',CONVERT(VARCHAR,@prod_time_2,108),''' ')
          END
      END
    ELSE
      BEGIN
        IF @prod_time_n = 'Y'
          SELECT @lv_sql = CONCAT(@lv_sql,' AND cb_prod_time IS NULL ')
      END

  IF CHARINDEX('%',@pass_fail_1) > 0
    SET @lv_wildcard = NULL
  ELSE
    SET @lv_wildcard = '%'

  IF @pass_fail_1 IS NOT NULL
    BEGIN
      IF @pass_fail_2 IS NOT NULL
        BEGIN
          IF @pass_fail_n = 'Y' 
            SELECT @lv_sql = CONCAT(@lv_sql,' AND UPPER(cb_pass_fail) NOT BETWEEN ''',UPPER(@pass_fail_1),''' AND ''',UPPER(@pass_fail_2),''' ')
          ELSE
            SELECT @lv_sql = CONCAT(@lv_sql,' AND UPPER(cb_pass_fail) BETWEEN ''',UPPER(@pass_fail_1),''' AND ''',UPPER(@pass_fail_2),''' ')
        END
      ELSE
        BEGIN
          IF @pass_fail_n = 'Y'
            SELECT @lv_sql = CONCAT(@lv_sql,' AND UPPER(cb_pass_fail) NOT LIKE ''',@lv_wildcard,UPPER(@pass_fail_1),@lv_wildcard,''' ')
          ELSE
            SELECT @lv_sql = CONCAT(@lv_sql,' AND UPPER(cb_pass_fail)  LIKE ''',@lv_wildcard,UPPER(@pass_fail_1),@lv_wildcard,''' ')
        END
    END
  ELSE
    BEGIN
      IF @pass_fail_2 IS NOT NULL
        BEGIN
          IF @pass_fail_n = 'Y'
            SELECT @lv_sql = CONCAT(@lv_sql,' AND UPPER(cb_pass_fail) NOT LIKE ''',@lv_wildcard,UPPER(@pass_fail_2),@lv_wildcard,''' ')
          ELSE
            SELECT @lv_sql = CONCAT(@lv_sql,' AND UPPER(cb_pass_fail)  LIKE ''',@lv_wildcard,UPPER(@pass_fail_2),@lv_wildcard,''' ')
        END
      ELSE
        BEGIN
          IF @pass_fail_n = 'Y'
            SELECT @lv_sql = CONCAT(@lv_sql,' AND cb_pass_fail IS NULL ')
        END
    END

  IF @order_by IS NOT NULL
    SELECT @lv_sql = CONCAT(@lv_sql,' ORDER BY ',@order_by)

  PRINT @lv_sql

  EXEC (@lv_sql)
