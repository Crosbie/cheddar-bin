USE [master]
GO

/****** Object:  Database [Glanbia_Ireland_BRG_Cheese]    Script Date: 21/05/2021 23:01:54 ******/
CREATE DATABASE [Glanbia_Ireland_BRG_Cheese]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Glanbia_Ireland_BRG_Cheese', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER\MSSQL\DATA\Glanbia_Ireland_BRG_Cheese.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'Glanbia_Ireland_BRG_Cheese_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER\MSSQL\DATA\Glanbia_Ireland_BRG_Cheese_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO

IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Glanbia_Ireland_BRG_Cheese].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET ANSI_NULL_DEFAULT OFF 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET ANSI_NULLS OFF 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET ANSI_PADDING OFF 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET ANSI_WARNINGS OFF 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET ARITHABORT OFF 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET AUTO_CLOSE OFF 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET AUTO_SHRINK OFF 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET AUTO_UPDATE_STATISTICS ON 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET CURSOR_DEFAULT  GLOBAL 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET CONCAT_NULL_YIELDS_NULL OFF 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET NUMERIC_ROUNDABORT OFF 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET QUOTED_IDENTIFIER OFF 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET RECURSIVE_TRIGGERS OFF 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET  DISABLE_BROKER 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET TRUSTWORTHY OFF 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET PARAMETERIZATION SIMPLE 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET READ_COMMITTED_SNAPSHOT OFF 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET HONOR_BROKER_PRIORITY OFF 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET RECOVERY SIMPLE 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET  MULTI_USER 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET PAGE_VERIFY CHECKSUM  
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET DB_CHAINING OFF 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET DELAYED_DURABILITY = DISABLED 
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET QUERY_STORE = OFF
GO

ALTER DATABASE [Glanbia_Ireland_BRG_Cheese] SET  READ_WRITE 
GO

