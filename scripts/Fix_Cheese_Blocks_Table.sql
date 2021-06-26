USE [Glanbia_Ireland_Cheese]
GO

/****** Object:  Table [dbo].[Cheese_Blocks]    Script Date: 21/05/2021 23:53:36 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

DROP TABLE [dbo].[Cheese_Blocks]
GO

CREATE TABLE [dbo].[Cheese_Blocks] (
	[Block_ID] [int] NOT NULL IDENTITY PRIMARY KEY,
	[Year_Code] [char](1) NOT NULL,
	[Plant_Code] [char](1) NOT NULL,
	[Day_Number] [numeric](3, 0) NOT NULL,
	[Prod_Date] [date] NOT NULL,
	[Prod_Time] [time](7) NOT NULL,
	[Upload_Date] [date] NULL,
	[Upload_Time] [time](7) NULL,
	[Upload_Dir] [nvarchar](100) NULL,
	[Upload_File] [nvarchar](100) NULL,
	[Pallet] [numeric](18, 0) NULL,
	[Block] [numeric](18, 0) NULL,
	[Pass_Fail] [char](1) NOT NULL,
	[Block_Image] [image] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[Cheese_Blocks] ADD  CONSTRAINT [DF_Cheese_Blocks_Pass_Fail]  DEFAULT ('P') FOR [Pass_Fail]
GO
