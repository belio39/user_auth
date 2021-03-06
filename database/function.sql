USE users
GO

CREATE OR ALTER PROCEDURE dbo.createUsers (
    @id VARCHAR(50),
    @userName VARCHAR(10),
    @fullName VARCHAR(10),
    @email VARCHAR(255),
    @age INT,
    @password VARCHAR(255),
    @role VARCHAR(20) = 'STUDENT'
)
AS
INSERT into dbo.Users
VALUES (@id, @userName, @fullName, @email, @age, @password, @role)
GO

CREATE OR ALTER PROCEDURE dbo.getAllUsers
AS
SELECT * 
FROM dbo.Users
GO

CREATE OR ALTER PROCEDURE dbo.getUserByUserName
(@userName VARCHAR(10))
AS
SELECT *
FROM dbo.Users
WHERE userName = @userName;
GO

CREATE OR ALTER PROCEDURE dbo.getUserById
(@id VARCHAR(50))
AS
SELECT *
FROM dbo.Users
WHERE id = @id;
GO

CREATE OR ALTER PROCEDURE dbo.resetPassWord
(@id VARCHAR(50),@password VARCHAR(255))
AS
UPDATE dbo.Users
SET
    password = @password 
WHERE id = @id
GO

CREATE OR ALTER PROCEDURE dbo.updateUser
    @id VARCHAR(50),
    @userName VARCHAR(10),
    @fullName VARCHAR(10),
    @email VARCHAR(255),
    @age INT,
    @password VARCHAR(255),
    @role VARCHAR(20) = 'STUDENT'
AS
BEGIN
UPDATE dbo.Users
SET
    userName = @userName,
    fullName = @fullName,
    email = @email,
    age = @age,
    password = @password,
    role = @role
WHERE id = @id
END;
GO

CREATE OR ALTER PROCEDURE dbo.deleteUser
 @id VARCHAR(50)

 AS
 BEGIN
 DELETE FROM dbo.Users
 WHERE id=@id;
 END
 GO

SELECT * from Users