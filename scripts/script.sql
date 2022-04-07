USE [Glanbia_Ireland_Cheese]
GO

/**** Object:  Table [dbo].[Cheese_Blocks]    Script Date: 21/05/2021 23:53:36 ****/
-- SET ANSI_NULLS ON
-- GO

-- SET QUOTED_IDENTIFIER ON
-- GO

-- DROP TABLE [dbo].[Cheese_Blocks]
SELECT * FROM [dbo].[Cheese_Blocks]
GO
-- CREATE TABLE [dbo].[Cheese_Blocks](
--  [cb_id] [uniqueidentifier] NOT NULL,
--  [cb_year_code] [char](1) NULL,
--  [cb_plant_code] [char](1) NOT NULL,
--  [cb_day_number] [numeric](3, 0) NULL,
--  [cb_prod_date] [date] NOT NULL,
--  [cb_prod_time] [time](7) NOT NULL,
--  [cb_upload_date] [date] NOT NULL,
--  [cb_upload_time] [time](7) NOT NULL,
--  [cb_upload_dir] [nvarchar](200) NOT NULL,
--  [cb_upload_file] [nvarchar](100) NOT NULL,
--   [cb_target_dir] [nvarchar](200) NOT NULL,
--  [cb_pallet] [numeric](18, 0) NULL,
--  [cb_block] [numeric](18, 0) NULL,
--  [cb_pass_fail] [char](1) NOT NULL,
--  [cb_block_image] [image] NULL,
--  CONSTRAINT [PK_Cheese_Blocks] PRIMARY KEY CLUSTERED 
-- (
--  [cb_id] ASC
-- )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
-- ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
-- GO

-- ALTER TABLE [dbo].[Cheese_Blocks] ADD  CONSTRAINT [DF_Cheese_Blocks_cb_id]  DEFAULT (newid()) FOR [cb_id]
-- GO

-- ALTER TABLE [dbo].[Cheese_Blocks] ADD  CONSTRAINT [DF_Cheese_Blocks_cb_pass_fail]  DEFAULT ('P') FOR [cb_pass_fail]
-- GO
