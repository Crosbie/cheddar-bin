USE [Glanbia_Ireland_Cheese]
GO

/****** Object:  Table [dbo].[Cheese_Blocks]    Script Date: 21/05/2021 23:53:36 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Cheese_Blocks](
	[Block_ID] [uniqueidentifier] NOT NULL,
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
	[Block_Image] [image] NULL,
 CONSTRAINT [PK_Cheese_Blocks] PRIMARY KEY CLUSTERED 
(
	[Block_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[Cheese_Blocks] ADD  CONSTRAINT [DF_Cheese_Blocks_Block_ID]  DEFAULT (newid()) FOR [Block_ID]
GO

ALTER TABLE [dbo].[Cheese_Blocks] ADD  CONSTRAINT [DF_Cheese_Blocks_Pass_Fail]  DEFAULT ('P') FOR [Pass_Fail]
GO

USE [Glanbia_Ireland_Cheese]
GO

/****** Object:  Table [dbo].[Day_Codes]    Script Date: 21/05/2021 23:54:16 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Day_Codes](
	[Year_Code] [char](1) NOT NULL,
	[Plant_Code] [char](1) NOT NULL,
	[Day_Number] [numeric](3, 0) NOT NULL,
	[Last_Pallet] [numeric](18, 0) NULL,
	[Last_Block] [numeric](18, 0) NULL,
 CONSTRAINT [PK_Day_Codes] PRIMARY KEY CLUSTERED 
(
	[Year_Code] ASC,
	[Plant_Code] ASC,
	[Day_Number] ASC
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

CREATE TABLE [dbo].[Directories](
	[Dir_Type] [nvarchar](10) NOT NULL,
	[Dir_Path] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_Directories] PRIMARY KEY CLUSTERED 
(
	[Dir_Type] ASC
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

CREATE TABLE [dbo].[Parameters](
	[Par_Key] [nvarchar](50) NOT NULL,
	[Par_Value] [nvarchar](100) NULL,
 CONSTRAINT [PK_Parameters] PRIMARY KEY CLUSTERED 
(
	[Par_Key] ASC
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
	[Plant_Code] [char](1) NOT NULL,
	[Plant_Name] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_Plant_Codes] PRIMARY KEY CLUSTERED 
(
	[Plant_Code] ASC
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
	[Year_Code] [char](1) NOT NULL,
	[Year] [numeric](4, 0) NOT NULL,
 CONSTRAINT [PK_Year_Codes] PRIMARY KEY CLUSTERED 
(
	[Year_Code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO



USE [Glanbia_Ireland_Cheese]
SELECT Dir_Type, Dir_Path FROM Directories;
INSERT INTO Directories (Dir_Type, Dir_Path) VALUES ("Good","./")
SELECT Dir_Type, Dir_Path FROM Directories;
