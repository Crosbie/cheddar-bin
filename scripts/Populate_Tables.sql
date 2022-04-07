USE [Glanbia_Ireland_Cheese]
GO

insert into [dbo].[Year_Codes] (yc_code,yc_year) values ('K',2018)
go
insert into [dbo].[Year_Codes] (yc_code,yc_year) values ('L',2019)
go
insert into [dbo].[Year_Codes] (yc_code,yc_year) values ('M',2020)
go
insert into [dbo].[Year_Codes] (yc_code,yc_year) values ('P',2021)
go
 
insert into [dbo].[Cheese_Parameters] (cp_key, cp_value) values ('DAYCODE_START_HOUR','13')
go
insert into [dbo].[Cheese_Parameters] (cp_key, cp_value) values ('BLOCKS_PER_PALLET','50')
go
insert into [dbo].[Cheese_Parameters] (cp_key,cp_value) values ('DAYS_TO_RETAIN_IMAGES',30);
go

DELETE FROM [dbo].[Cheese_Directories]
insert into [dbo].[Cheese_Directories] (cd_path, cd_pass_fail, cd_source_target, cd_active, cd_sort_order) values ('./test/source/pass', 'P', 'S', 'Y', 10)
insert into [dbo].[Cheese_Directories] (cd_path, cd_pass_fail, cd_source_target, cd_active, cd_sort_order) values ('./test/source/fail', 'F', 'S', 'Y', 10)
insert into [dbo].[Cheese_Directories] (cd_path, cd_pass_fail, cd_source_target, cd_active, cd_sort_order) values ('./test/target/pass', 'P', 'T', 'Y', 10)
insert into [dbo].[Cheese_Directories] (cd_path, cd_pass_fail, cd_source_target, cd_active, cd_sort_order) values ('./test/target/fail', 'F', 'T', 'Y', 10)
go

insert into [dbo].[Plant_Codes] (pc_code, pc_name) values ('C','Ballyragget')
go
