USE users
GO

-- Drop the table if it already exists
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL
DROP TABLE dbo.Users
GO

CREATE TABLE dbo.Users (
    id VARCHAR(50) PRIMARY KEY NOT NULL,
    userName VARCHAR(10) UNIQUE NOT NULL,
    fullName VARCHAR(10)  NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INT NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'STUDENT'
)
GO