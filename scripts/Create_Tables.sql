USE [Glanbia_Ireland_Cheese]
GO

/****** Object:  Table [dbo].[Cheese_Blocks]    Script Date: 21/05/2021 23:53:36 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Cheese_Blocks](
	[cb_id] [uniqueidentifier] NOT NULL,
	[cb_year_code] [char](1) NULL,
	[cb_plant_code] [char](1) NOT NULL,
	[cb_day_number] [numeric](3, 0) NULL,
	[cb_prod_date] [date] NOT NULL,
	[cb_prod_time] [time](7) NOT NULL,
	[cb_upload_date] [date] NOT NULL,
	[cb_upload_time] [time](7) NOT NULL,
	[cb_upload_dir] [nvarchar](100) NOT NULL,
	[cb_upload_file] [nvarchar](100) NOT NULL,
	[cb_pallet] [numeric](18, 0) NULL,
	[cb_block] [numeric](18, 0) NULL,
	[cb_pass_fail] [char](1) NOT NULL,
	[cb_block_image] [image] NULL,
 CONSTRAINT [PK_Cheese_Blocks] PRIMARY KEY CLUSTERED 
(
	[cb_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[Cheese_Blocks] ADD  CONSTRAINT [DF_Cheese_Blocks_cb_id]  DEFAULT (newid()) FOR [cb_id]
GO

ALTER TABLE [dbo].[Cheese_Blocks] ADD  CONSTRAINT [DF_Cheese_Blocks_cb_pass_fail]  DEFAULT ('P') FOR [cb_pass_fail]
GO

USE [Glanbia_Ireland_Cheese]
GO

/****** Object:  Table [dbo].[Day_Codes]    Script Date: 21/05/2021 23:54:16 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Day_Codes](
	[dc_year_code] [char](1) NOT NULL,
	[dc_plant_code] [char](1) NOT NULL,
	[dc_day_number] [numeric](3, 0) NOT NULL,
	[dc_last_pallet] [numeric](18, 0) NULL,
	[dc_last_block] [numeric](18, 0) NULL,
 CONSTRAINT [PK_Day_Codes] PRIMARY KEY CLUSTERED 
(
	[dc_year_code] ASC,
	[dc_plant_code] ASC,
	[dc_day_number] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

USE [Glanbia_Ireland_Cheese]
GO

/****** Object:  Table [dbo].[Directories]    Script Date: 21/05/2021 23:54:34 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Cheese_Directories](
	[cd_path] [nvarchar](100) NOT NULL,
	[cd_pass_fail] [char](1) NOT NULL,
	[cd_source_target] [char](1) NOT NULL,
	[cd_active] [char](1) NULL,
	[cd_sort_order] [int],
 CONSTRAINT [PK_Cheese_Directories] PRIMARY KEY CLUSTERED 
(
	[cd_path] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

USE [Glanbia_Ireland_Cheese]
GO

/****** Object:  Table [dbo].[Parameters]    Script Date: 21/05/2021 23:55:41 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Cheese_Parameters](
	[cp_key] [nvarchar](50) NOT NULL,
	[cp_value] [nvarchar](100) NULL,
 CONSTRAINT [PK_Cheese_Parameters] PRIMARY KEY CLUSTERED 
(
	[cp_key] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

USE [Glanbia_Ireland_Cheese]
GO

/****** Object:  Table [dbo].[Plant_Codes]    Script Date: 21/05/2021 23:57:07 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Plant_Codes](
	[pc_code] [char](1) NOT NULL,
	[pc_name] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_Plant_Codes] PRIMARY KEY CLUSTERED 
(
	[pc_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

USE [Glanbia_Ireland_Cheese]
GO

/****** Object:  Table [dbo].[Year_Codes]    Script Date: 21/05/2021 23:57:35 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Year_Codes](
	[yc_code] [char](1) NOT NULL,
	[yc_year] [numeric](4, 0) NOT NULL,
 CONSTRAINT [PK_Year_Codes] PRIMARY KEY CLUSTERED 
(
	[yc_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

