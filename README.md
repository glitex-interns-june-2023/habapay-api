# Habapay Backend API

Welcome to HabaPay API documentation.  
HabaPay API is a RESTful API that uses JSON for serialization and JWT for authentication.  
All request and response keys follow a snake_case naming convention.

Below are the avaialble endopoints and their usage.

## Table of Contents

- [Signup and Signing with Google](#signup-and-signing-with-google)
- [User Login](#user-login)
- [User Registraton](#user-registration)
- [Send OTP](#send-otp)
- [Verify OTP](#verify-otp)
- [List All Admins](#list-all-admin-users)
- [Get Single Admin Record](#get-single-admin)
- [Check Wallet Balance](#check-wallet-balance)
- [Confirm Recipient Details](#confirm-recipient-details)
- [Send Money](#send-money)
- [Withdraw Cash](#withdraw-cash)
- [Deposit Cash](#deposit-cash)
- [List all Transactions](#list-all-transactions)
- [Single Transaction](#single-transaction)
- [List User Transactions](#list-user-transactions)
- [Update Login Pin](#update-login-pin)
- [Login with Pin](#login-with-pin)
- [List all Users](#list-all-users)
- [Update Business Details](#update-business-details)

---

### Signup and Signing with Google

**Endpoint**: `POST: /api/v1/auth/google`

#### Description

Register or login with a google token. Expects a valid google token.

#### Request Body

```json
{
  "token": "string|required| The google token"
}
```

#### Success Response

```json
{
  "success": true,
  "message": "string",
  "data": {
    "id": "integer",
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "username": "string",
    "phone": "string",
    "profile_url": "string",
    "role": "user",
    "is_verified": 0,
    "created_at": "string(timestamp)",
    "is_active": 1,
    "access_token": "string",
    "refresh_token": "string"
  }
}
```

#### Failure Response

```json
{
  "success": false,
  "message": "string| Error message from server"
}
```

### User Login

**Endpoint**: `POST: /api/v1/auth/login`

#### Description

Login with email and password. Expects a valid email and password.

#### Request Body

```json
{
  "email": "string|required| User's email",
  "password": "string|required| User's password"
}
```

#### Success Response

```json
{
  "success": "true",
  "message": "Login successful",
  "data": {
    "id": "integer",
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "username": "string",
    "phone": "string",
    "profile_url": "string",
    "location": "string",
    "role": "string",
    "is_verified": "boolean",
    "created_at": "timestamp",
    "is_active": "boolean",
    "access_token": "string",
    "refresh_token": "string"
  }
}
```

#### Failure Response

```json
{
  "success": "false",
  "message": "string| Error message from server"
}
```

### User Registration

**Endpoint**: `POST /api/v1/auth/register`

#### Description

Register new user

#### Request Body

```json
{
  "email": "string|required",
  "first_name": "string|required",
  "last_name": "string|required",
  "username": "string|required",
  "phone": "string|required",
  "password": "string| required"
}
```

#### Success Response

```json
{
  "success": true,
  "message": "string",
  "data": {
    "id": "integer",
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "username": "string",
    "phone": "string",
    "profile_url": "string",
    "location": "string",
    "role": "string",
    "is_verified": "boolean",
    "created_at": "timestamp",
    "is_active": "boolean",
    "access_token": "string",
    "refresh_token": "string"
  }
}
```

#### Failure Response

```json
{
  "success": false,
  "message": "string|Error message from server"
}
```

##### Inputs Validation Failure Response

```json
{
  "success": false,
  "message": "Validation error",
  "error": {
    "code": "ERR_VALIDATION_ERROR",
    "details": [
      {
        "field": "field_name1",
        "message": "validation message"
      },
      {
        "field": "field_name2",
        "message": "validation message2"
      },
      {
        "field": "field_name3",
        "message": "validation message3"
      }
    ]
  }
}
```

### Send OTP

**Endpoint** `POST /api/v1/auth/send-otp`

#### Description

Send OTP to verify ownership of a user's phone number

#### Request Body

```json
{
  "phone_number": "string|required|Phone number to be verified",
  "email": "string|required|Users's email (for secondary checks)"
}
```

#### Success Response

```json
{
  "success": true,
  "message": "string|(OTP sent successfully)"
}
```

#### Failure Response

```json
{
  "success": false,
  "message": "string|Error message from server"
}
```

### Verify OTP

**Endpoint**: `POST /api/v1/auth/verify-otp`

#### Description

Verify the OTP that was sent to user's phone

#### Request Body

```json
{
  "phone_number": "string|required|User's phone number that initiated verification",
  "otp": "integer|required|The OTP code"
}
```

#### Success Response

```json
{
  "success": true,
  "message": "string|(Phone verified successfully)"
}
```

### Admins Endpoints

### List All Admin Users

**Endpoint**: `GET /api/v1/admins`

#### Description

List all admins registered in the system

#### Parameters

- `page` (integer, optional): start page e.g. `?page=1`
- `per_page`(integer, optional): number of records to display e.g. `&per_page=3`. Use in combination with `?page` parameter above.

#### Success Sample Response

```json
{
  "success": true,
  "message": "Admins retrieved successfully",
  "data": {
    "page": 1,
    "total": 16,
    "per_page": 3,
    "previous_page": null,
    "next_page": 2,
    "last_page": 6,
    "data": [
      {
        "id": 2,
        "email": "admin@habapay.com",
        "first_name": "Admin",
        "last_name": "User",
        "username": "Admin User",
        "phone": "0114662464",
        "profile_url": null,
        "role": "admin",
        "location": "Nairobi, Kenya",
        "is_verified": 0,
        "is_active": 1,
        "created_at": "2023-08-31T12:27:24.000Z",
        "updated_at": "2023-08-31T12:27:24.000Z"
      },
      {
        "id": 4,
        "email": "Solon75@gmail.com",
        "first_name": "Hector",
        "last_name": "Morar",
        "username": "Danial65",
        "phone": "582-883-6883",
        "profile_url": null,
        "location": "Nairobi, Kenya",
        "role": "admin",
        "is_verified": 0,
        "is_active": 1,
        "created_at": "2023-08-31T12:27:24.000Z",
        "updated_at": "2023-08-31T12:27:24.000Z"
      },
      {
        "id": 5,
        "email": "Filiberto90@gmail.com",
        "first_name": "Bernie",
        "last_name": "Pouros",
        "username": "Napoleon45",
        "phone": "984-395-3010",
        "profile_url": null,
        "location": "Nairobi, Kenya",
        "role": "admin",
        "is_verified": 0,
        "is_active": 1,
        "created_at": "2023-08-31T12:27:24.000Z",
        "updated_at": "2023-08-31T12:27:24.000Z"
      }
    ]
  }
}
```

#### Error Response

```json
{
  "success": false,
  "message": "string|Error message from server"
}
```

### Get Single Admin

**Endpoint**: `GET /api/v1/admins/:adminId`

#### Description

Get single admin record based on admin Id

#### Paramseters

- `adminId`: (int,required): Id of the admin

#### Success Sample Response

```json
{
  "success": true,
  "message": "Admin retrieved successfully",
  "data": {
    "id": 2,
    "email": "admin@habapay.com",
    "first_name": "Admin",
    "last_name": "User",
    "username": "Admin User",
    "phone": "0114662464",
    "profile_url": null,
    "location": "Nairobi, Kenya",
    "role": "admin",
    "is_verified": 0,
    "is_active": 1,
    "created_at": "2023-08-31T12:27:24.000Z",
    "updated_at": "2023-08-31T12:27:24.000Z"
  }
}
```

#### Failure Response

```json
{
  "success": false,
  "message": "string|Error message from server"
}
```

## Wallet

### Check Wallet Balance

**Endpoint**: `/api/v1/wallet/balance`

#### Description

Check users's account balance

#### Query Parameters

- `phone`(string,required): Account holder's phone number e.g. `?phone=`

#### Success Response

```json
{
  "success": true,
  "message": "Wallet information retrieved successfully",
  "data": {
    "user_id": "integer",
    "balance": "float",
    "currency": "string",
    "last_update": "string(date)"
  }
}
```

#### Failure Response

```json
{
  "success": false,
  "message": "string|Error message from server"
}
```

### Confirm Recipient Details

**Endpoint**: `GET /api/v1/wallet/confirm-details`

#### Description

Get recipient information to confirm before send

#### Query Parameters

- `phone`(string,required): Recipient phone number e.g. `?phone=`

#### Success Response

```json
{
  "success": true,
  "data": {
    "phone": "string",
    "full_name": "string"
  }
}
```

#### Failure Response

```json
{
  "success": false,
  "message": "string|Error message from server"
}
```

### Send Money

**Endpoint**: `POST /api/v1/wallet/send-money`

#### Description

Send money to recipient

#### Request Body

```json
{
  "sender_phone": "string|required",
  "receiver_phone": "string|required",
  "amount": "float|required"
}
```

#### Success Response

```json
{
  "success": true,
  "message": "string|(Send money successful)",
  "data": {
    "transaction_id": "integer",
    "transaction_message": "string",
    "amount": "float",
    "currency": "string",
    "timestamp": "string(date)",
    "balance": "float"
  }
}
```

#### Failure Response

```json
{
  "success": false,
  "message": "string|Error message from server"
}
```

### Withdraw Cash

**Endpoint**: `POST /api/v1/wallet/withdraw`

#### Description

Withdraw funds fron one account

#### Request Body

```json
{
  "sender_phone": "string|requried",
  "receiver_phone": "string|required",
  "amount": "float|required"
}
```

#### Sucess Response

```json
{
  "success": true,
  "message": "string|(Withdraw successuful)",
  "data": {
    "transaction_id": "integer",
    "transaction_message": "string",
    "amount": "float",
    "currency": "string",
    "timestamp": "string(date)",
    "balance": "float"
  }
}
```

#### Failure Response

```json
{
  "success": false,
  "message": "string|Error message from server"
}
```

### Deposit Cash

**Endpoint**: `POST /api/v1/wallet/deposit`

#### Description

Deposit funds into an account from M-Pesa

#### Request Body

```json
{
  "sender_phone": "string|required",
  "mpesa_number": "string|required",
  "amount": "float|required"
}
```

#### Success Response

```json
{
  "success": true,
  "message": "string|(Deposit successful)",
  "data": {
    "transaction_id": "integer",
    "transaction_message": "string",
    "amount": "float",
    "currency": "string",
    "timestamp": "string(date)",
    "balance": "float"
  }
}
```

#### Failure Response

```json
{
  "success": false,
  "message": "string|Error message from server"
}
```

### List All Transactions

**Endpoint** `GET /api/v1/transactions`

#### Description

Get all transactions info

#### Parameters

- `type` (string, optional) - Transaction type - (sent|withdwaw|deposit)
- `page` (integer, optional) - Page to start querying(default 1)
- `per_page` (integer) - Number of records to show(default 10)

### Success Response

```json
{
  "page": 1,
  "total": 68,
  "per_page": 10,
  "previous_page": null,
  "next_page": 2,
  "last_page": 7,
  "data": [
    {
      "date": "Thu Aug 24 2023",
      "transactions": [
        {
          "full_name": "Celestine Goldner",
          "phone": "250-617-4427",
          "currency": "Ksh",
          "amount": 184.93,
          "type": "withdraw",
          "timestamp": "2:26 AM"
        }
      ]
    },
    {
      "date": "Thu Aug 17 2023",
      "transactions": [
        {
          "full_name": "Josianne Okuneva",
          "phone": "849-342-8945",
          "currency": "Ksh",
          "amount": 962.61,
          "type": "withdraw",
          "timestamp": "8:16 PM"
        }
      ]
    }
  ]
}
```

#### Single Transaction

**Endpoint** `GET /api/v1/transactions/:id`

#### Description

Get a single transaction based on its transaction ID

#### Parameters

- `id` (integer, required) - Transaction id

#### Success Response

```json
{
  "success": true,
  "data": {
    "transaction_id": 12,
    "full_name": "Obie Pagac",
    "phone": "316-351-6939",
    "amount": 493.36,
    "type": "withdraw",
    "currency": "Ksh",
    "timestamp": "27 May 2023, 4:14 AM"
  }
}
```

### List User Transactions

**Endpoint**: `GET /api/v1/users/:userId/transactions`

#### Description

Get transactions made by the user identified by the :userId parameter.  
Transaction types in response body can either be: `sent|received|deposit|withdraw`

#### Route Params

- `userId`- (integer,required) - Id of the user

#### Query Params

- `page` (integer, optional) - Page to start querying. Defaults to `1`
- `per_page` (integer, optional)- Number of records to fetch per each page. Defaults to `10`
- `type` (string, optional) - Filter results by transacton type. Either: `sent|received|deposit|withdraw`

#### Success Response

```json
{
  "success": true,
  "data": {
    "page": 1,
    "total": 15,
    "per_page": 10,
    "previous_page": null,
    "next_page": 2,
    "last_page": 2,
    "data": [
      {
        "date": "Mon Aug 07 2023",
        "transactions": [
          {
            "transaction_id": "20",
            "full_name": "Admin User",
            "phone": "0114662464",
            "currency": "Ksh",
            "amount": 53.29,
            "type": "sent",
            "timestamp": "3:38 PM"
          }
        ]
      },
      {
        "date": "Fri Jul 28 2023",
        "transactions": [
          {
            "transaction_id": "54",
            "full_name": "Jolie Powlowski",
            "phone": "766-227-1867",
            "currency": "Ksh",
            "amount": 142.88,
            "type": "received",
            "timestamp": "7:04 AM"
          }
        ]
      }
    ]
  }
}
```

#### Validations

- User must exist

### Update Login PIN

**Endpoint**: `PUT /api/v1/auth/login/pin`

#### Description

Create or update your login pin

#### Request Body

```json
{
  "email": "user email",
  "pin": "string|integer"
}
```

#### Success Response

```json
{
  "success": true,
  "message": "Login PIN updated successfully"
}
```

### Login With PIN

**Endpoint**: `POST /api/v1/auth/login/pin`

#### Description

Login with PIN instead of password(If you have set a login PIN)

#### Request Body

```json
{
  "email": "user email",
  "pin": "string|integer| Valid login pin"
}
```

#### Success Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": 32,
    "email": "admin@habapay.com",
    "first_name": "Admin",
    "last_name": "User",
    "username": "Admin User",
    "phone": "0712345678",
    "profile_url": null,
    "role": "admin",
    "is_verified": 0,
    "is_active": 1,
    "created_at": "2023-08-31T12:27:24.000Z",
    "updated_at": "2023-08-31T12:27:24.000Z",
    "access_token": "access_token_here",
    "refresh_token": "refresh_token_here"
  }
}
```

### List All Users

**Endpoint**: `GET /api/v1/users`

#### Description

List all users registered in the system

#### Parameters

- `page` (integer, optional): start page e.g. `?page=1`
- `per_page`(integer, optional): number of records to display e.g. `&per_page=3`

#### Success Sample Response

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "page": 1,
    "total": 30,
    "per_page": 10,
    "previous_page": null,
    "next_page": 2,
    "last_page": 3,
    "data": [
      {
        "id": 1,
        "email": "testuser@habapay.com",
        "first_name": "Test",
        "last_name": "User",
        "username": "Test User",
        "phone": "0712345678",
        "profile_url": null,
        "role": "user",
        "is_verified": 0,
        "is_active": 1,
        "created_at": "2023-08-31T12:27:24.000Z",
        "updated_at": "2023-08-31T12:27:24.000Z"
      },
      {
        "id": 7,
        "email": "Hermina.Beatty@hotmail.com",
        "first_name": "Gust",
        "last_name": "Pagac",
        "username": "Hope79",
        "phone": "811-522-7717",
        "profile_url": null,
        "role": "user",
        "is_verified": 0,
        "is_active": 1,
        "created_at": "2023-08-31T12:27:24.000Z",
        "updated_at": "2023-08-31T12:27:24.000Z"
      }
    ]
  }
}
```

#### Update Business Details

**Endpoint**: `PUT /api/v1/users/:userId/business`

#### Description

Update business details for a user. NOTE: A default business account is automatically created for a user when they register.

#### Route Params

- `userId` (integer, required) - Id of the user

#### Request Body

```json
{
  "name": "string|optional",
  "category": "string|optional",
  "location": "string|optional"
}
```

#### Sample Success Response

```json
{
  "success": true,
  "message": "Business updated successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "name": "New Business Name",
    "category": null,
    "location": null,
    "created_at": "2023-09-01T02:20:01.000Z",
    "updated_at": "2023-09-01T02:20:01.224Z"
  }
}
```
