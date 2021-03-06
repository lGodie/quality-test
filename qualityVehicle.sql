USE [qualityVehicles]
GO
/****** Object:  Table [dbo].[migrations]    Script Date: 10/7/2020 4:33:25 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[migrations](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[timestamp] [bigint] NOT NULL,
	[name] [varchar](255) NOT NULL,
 CONSTRAINT [PK_e37dc71df1f4d1276e416643929] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users]    Script Date: 10/7/2020 4:33:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[username] [varchar](16) NOT NULL,
	[password] [varchar](max) NOT NULL,
	[isActive] [bit] NOT NULL,
 CONSTRAINT [PK_a3ffb1c0c8416b9fc6f907b7433] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_fe0bb3f6520ee0469504521e710] UNIQUE NONCLUSTERED 
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

INSERT INTO [dbo].[users]
           ([username]
           ,[password]
           ,[isActive])
     VALUES
           ('admin','admin', 1)
GO
/****** Object:  Table [dbo].[vehicles]    Script Date: 10/7/2020 4:33:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[vehicles](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[plaque] [varchar](10) NOT NULL,
	[model] [int] NOT NULL,
	[colour] [varchar](32) NULL,
	[picturePath] [varchar](256) NULL,
	[insertDate] [date] NULL,
	[updateDate] [date] NULL,
	[active] [bit] NULL,
	[price] [decimal](9, 2) NULL,
 CONSTRAINT [PK_18d8646b59304dce4af3a9e35b6] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[users] ADD  CONSTRAINT [DF_409a0298fdd86a6495e23c25c66]  DEFAULT ((1)) FOR [isActive]
GO
ALTER TABLE [dbo].[vehicles] ADD  CONSTRAINT [DF_1470bb42c0326b302ffcea693f1]  DEFAULT ((0)) FOR [price]
GO
