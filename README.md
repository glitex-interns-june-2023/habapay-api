# Habapay Backend API

Welcome to HabaPay API documentation.  
HabaPay API is a RESTful API that uses JSON for serialization and JWT for authentication.  
All request and response keys follow a `snake_case` naming convention.

Below are the available endpoints and their usage.

## Table of Contents

- [Authentication](#authentication)

  - [Signup and Signin with Google](#signup-and-signing-with-google)
  - [User Login](#user-login)
  - [Login with Pin](#login-with-pin)
  - [Update Login Pin](#update-login-pin)
  - [Reset Password](#reset-password)
  - [Update Password](#update-password)

- [Verifications](#verifications)
  - [Send OTP](#send-otp)
  - [Verify OTP](#verify-otp)
  - [Send PIN by Email](#send-pin-by-email)
  - [Verify PIN](#verify-pin)
  - [Send Email Verification Link](#send-email-verification-link)
- [Wallet](#wallet)
  - [Check Wallet Balance](#check-wallet-balance)
  - [Deposit Cash](#deposit-cash)
  - [Send Money](#send-money)
  - [Confirm Recipient Details](#confirm-recipient-details)
  - [Withdraw Cash](#withdraw-cash)
- [Transactions](#transactions)

  - [List all Transactions](#list-all-transactions)
  - [Single Transaction](#single-transaction)
  - [List User Transactions](#list-user-transactions)

- [Statements](#statements)
  - [Download Statement](#download-statement)

- [Users](#users)
  - [List all Users](#list-all-users)
  - [Update User Business Details](#update-business-details)
- [Admin](#admin)

  - [Register Admin: /api/v1/auth/register](#register-admin)
  - [List All Admins](#list-all-admin-users)
  - [Get Single Admin Record](#get-single-admin)
  - [Pending and Approved Transactions: /api/v1/admins/transactions](#pending-and-approved-transactions)
  - [Transaction Info: /api/v1/admins/transactions/{id}](#transaction-info)
  - [Approve a Transaction: /api/v1/admins/transactions/{id}/approve](#approve-a-transaction)
  - [List Users: /api/v1/admins/users](#list-users-admin)
  - [List New Users: /api/v1/admins/users/new](#list-new-users)
  - [List User Info: /api/v1/admins/users/{id}](#list-user-info)
  - [Users Recent Activity: /api/v1/admins/users/activity](#users-recent-activity)
  - [User Recent Activity: /api/v1/admins/users/{id}/activity](#user-recent-activity)
  - [Suspend User Account: /api/v1/admins/users/{id}/suspend](#suspend-user-account)
  - [UnSuspend User Account: /api/v1/admins/users/{id}/unsuspend](#unsuspend-user-account)
  - [Delete User Account: /api/v1/admins/users/{id}](#delete-user-account)
  - [Update User Account: /api/v1/admins/uses/{id}](#update-user-account)

- [Analytics](#analytics)
  - [Overview: /api/v1/analytics/overview](#analytics-overview)
  - [Overview (Recent Activity): /api/v1/analytics/activity](#analytics-recent-activity)

---

## Authentication

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
    "is_phone_verified": 0,
    "is_email_verified": 0,
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
    "is_phone_verified": "boolean",
    "is_email_verified": "boolean",
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

#### Inputs Validation Failure Response

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

### Verifications

### Send OTP

**Endpoint** `POST /api/v1/verifications/otp/send`

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

**Endpoint**: `POST /api/v1/verifications/otp/verify`

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

### Send PIN By Email

**Endpoint** `POST /api/v1/verifications/pin/send`

#### Description

Send verification PIN to users email to confirm identity.  
Default PIN expiry time is `5 minutes`

#### Request Body

```json
{
  "email": "string| Registered users's email"
}
```

#### Success Response

```json
{
  "success": true,
  "message": "A verification pin has been sent to your email account that you entered."
}
```

### Verify PIN

**Endpoint** `POST /api/v1/verifications/pin/verify`

#### Description

Verify the PIN that was sent to user's email

#### Request Body

```json
{
  "email": "string| Registered user's email",
  "pin": "integer| Received PIN"
}
```

#### Success Response

```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### Send Email Verification Link

**Endpoint** `POST /api/v1/verifications/email/send`

#### Description

Send a verification link to user's email.

#### Request Body

```json
{
  "email": "string| Registered users's email"
}
```

#### Success Response

```json
{
  "success": true,
  "message": "A verification email has been sent to your email account that you entered."
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
        "is_phone_verified": 0,
        "is_email_verified": 0,
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
        "is_phone_verified": 0,
        "is_email_verified": 0,
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
        "is_phone_verified": 0,
        "is_email_verified": 0,
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
    "is_phone_verified": 0,
    "is_email_verified": 0,
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

## Transactions

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

### Reset Password

**Endpoint**: `POST /api/v1/auth/reset-password`

#### Description

Send a reset password link to user's email

#### Request Body

```json
{
  "email": "user email"
}
```

#### Success Response

```json
{
  "success": true,
  "message": "Password reset link sent successfully. Please check your email"
}
```

### Update Password

**Endpoint**: `PUT /api/v1/auth/password`

#### Description

Update login password. You must have sent a reset-password request and provided a valid reset password token.  
Reset password token expiry time is `10 minutes` by default.

#### Request Body

```json
{
  "email": "user email",
  "password": "string|new password",
  "token": "string|reset password token"
}
```

#### Success Response

```json
{
  "success": true,
  "message": "Password updated successfully"
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
    "location": "Nairobi, Kenya",
    "is_phone_verified": 0,
    "is_email_verified": 0,
    "is_active": 1,
    "created_at": "2023-08-31T12:27:24.000Z",
    "updated_at": "2023-08-31T12:27:24.000Z",
    "access_token": "access_token_here",
    "refresh_token": "refresh_token_here"
  }
}
```

## Statements

### Download Statement

**Endpoint** `POST /api/v1/statement/download`

#### Description

Generate and send a statement to user's email for a certain period and transaction type

#### Request Body

NOTE: Date Format is `YYYY/MM/DD`

```json
{
  "email": "string|required|User's email",
  "start_date": "date|required|Start date of the statement",
  "end_date": "date|required|End date of the statement",
  "transaction_type": "string|required|Transaction type (allowed values: all, sent, deposit, withdraw)"
}
```

#### Success Response

```json
{
  "success": true,
  "message": "Statement has been generated and sent to your email. Please check your email inbox."
}
```

### Failure Response

```json
{
  "success": false,
  "message": "string|Error message from server"
}
```

## Users

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
        "location": "Nairobi, Kenya",
        "role": "user",
        "is_phone_verified": 0,
        "is_email_verified": 0,
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
        "location": "Nairobi, Kenya",
        "role": "user",
        "is_phone_verified": 0,
        "is_email_verified": 0,
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

## Admin

### Register Admin

**Endpoint** `POST /api/v1/auth/register`

####

Superadmin create other admin accounts

#### Request Body

```json
{
  "username": "Test Admin",
  "phone": "0712345678",
  "email": "test-admin@habapay.com",
  "password": "password",
  "secondary_phone": "",
  "business_name": "John's Business",
  "location": "Nairobi, Kenya",
  "login_pin": "1234"
}
```

### Sample success Response

```json
{
  "success": true,
  "message": "Admin registered successfully",
  "data": {
    "id": 1,
    "email": "test-admin@habapay.com",
    "first_name": null,
    "last_name": null,
    "username": "Test Admin",
    "phone": "0712345678",
    "secondary_phone": "",
    "profile_url": null,
    "location": "Nairobi, Kenya",
    "role": "admin",
    "is_phone_verified": false,
    "is_email_verified": false,
    "is_active": true,
    "created_at": "2023-09-02T04:28:13.000Z",
    "updated_at": "2023-09-02T04:28:13.000Z",
    "access_token": "string",
    "refresh_token": "string"
  }
}
```

### Pending And Approved Transactions

**Endpoint**: `GET /api/v1/admins/transactions`

#### Description

Get all pending and approved transactions

#### Query Parameters

- `page` (integer, optional): start page e.g. `?page=1`
- `per_page`(integer, optional): number of records to display e.g. `&per_page=3`
- `status` (string, optional): transaction status e.g. `?status=pending`or `?status=approved`

#### Success Sample

```json
{
  "success": true,
  "message": "Transactions retrieved successfully",
  "data": {
    "page": 1,
    "total": 105,
    "per_page": 10,
    "previous_page": null,
    "next_page": 2,
    "last_page": 11,
    "data": [
      {
        "transaction_id": 158,
        "full_name": "Odie Rolfson",
        "phone": "868-954-6828",
        "currency": "Ksh",
        "amount": 535.91,
        "type": "withdraw",
        "status": "pending",
        "timestamp": "6:35 PM"
      },
      {
        "transaction_id": 28,
        "full_name": "Edward Will",
        "phone": "242-532-0149",
        "currency": "Ksh",
        "amount": 967.26,
        "type": "sent",
        "status": "pending",
        "timestamp": "11:41 PM"
      }
    ]
  }
}
```

### Approve a Transaction

**Endpoint** `POST /api/v1/admins/transactions/{id}/approve`

#### Description

Approve a transaction identified by transaction id

#### Parameters

- `id` (integer, required): Transaction id

#### Success Response

```json
{
  "success": true,
  "message": "Transaction approved successfully"
}
```

#### Failure Response

```json
{
  "success": false,
  "message": "string|Error message from server"
}
```

### Transaction Info

**Endpoint**: `GET /api/v1/admins/transactions/{id}`

#### Description

Get transaction information by its id. Everything [Same as here](#single-transaction)

### List Users Admin

**Endpoint** `GET /api/v1/admins/users`

#### Description

List users data formatted to match the admin UI

#### Query Parameters

- `page` (integer, optional): start page e.g. `?page=1`
- `per_page`(integer, optional): number of records to display e.g. `&per_page=3`

#### Success Sample Respone

```json
{
  "success": true,
  "message": "All users",
  "data": {
    "page": 1,
    "total": 19,
    "per_page": 10,
    "previous_page": null,
    "next_page": 2,
    "last_page": 2,
    "data": [
      {
        "id": 2,
        "username": "Test User",
        "phone": "0712345678",
        "email": "testuser@habapay.com",
        "status": "Active",
        "currency": "Ksh",
        "balance": 1000
      },
      {
        "id": 7,
        "username": "Devin_Kuhic",
        "phone": "677-567-1413",
        "email": "Kevin66@yahoo.com",
        "status": "Active",
        "currency": "Ksh",
        "balance": 644.42
      },
      {
        "id": 10,
        "username": "Ewald.Schumm68",
        "phone": "719-235-9727",
        "email": "Liliane.Muller@hotmail.com",
        "status": "Active",
        "currency": "Ksh",
        "balance": 646.01
      }
    ]
  }
}
```

### List New Users

**Endpoint**: `GET /api/v1/admins/users/new`

#### Description

Get an overview of users and their registration dates.  
Users are grouped in terms of their registration dates, with those registered in the same day in their single array.

#### Query Parameters

- `page` (integer, optional): start page e.g. `?page=1`
- `per_page`(integer, optional): number of records to display e.g. `&per_page=3`

#### Success Sample Response

```json
{
  "success": true,
  "message": "New users",
  "data": {
    "page": 1,
    "total": 4,
    "per_page": 2,
    "previous_page": null,
    "next_page": 2,
    "last_page": 2,
    "data": [
      {
        "date": "Tue Sep 05 2023",
        "users": [
          {
            "id": 5,
            "username": "Angel",
            "email": "angel@habapay.com"
          },
          {
            "id": 4,
            "username": "Dev",
            "email": "dev@habapay.com"
          }
        ]
      }
    ]
  }
}
```

### List User Info

**Endpoint** `GET /api/v1/admins/users/{id}`

#### Description

Get user information by id. More information about the user is available here since it is an admin viewing it.

#### Route Parameters

- `id` (integer, required)- User id

#### Success Sample Response

```json
{
  "success": true,
  "message": "User",
  "data": {
    "id": 4,
    "username": "Dev",
    "email": "dev@habapay.com",
    "phone": "0758826552",
    "secondary_phone": null,
    "location": "Nairobi, Kenya",
    "is_active": 1,
    "is_phone_verified": 0,
    "is_email_verified": 0,
    "created_at": "5 September 2023, 4:34 AM",
    "wallet": {
      "balance": 59,
      "currency": "Ksh"
    },
    "business": {
      "name": "Dev's Business",
      "location": "Machakos, Kenya",
      "category": null,
      "created_at": "5 September 2023, 4:34 AM"
    }
  }
}
```

### User Recent Activity

**Endpoint** `GET /api/v1/admins/users/{id}/activity`

#### Description

Get recent user activity

#### Route Parameters

- `id` (integer, required): User id

#### Query Parameters

- `page` (integer, optional): start page e.g. `?page=1`
- `per_page`(integer, optional): number of records to display e.g. `&per_page=3`
- `type` (string, optional) - filter by activity type (`create_account|send|deposit|withdraw`)

#### Success Sample Response

```json
{
  "success": true,
  "message": "User activity",
  "data": {
    "page": 1,
    "total": 1,
    "per_page": 10,
    "previous_page": null,
    "next_page": null,
    "last_page": 1,
    "data": [
      {
        "id": 1,
        "user_id": 1,
        "message": "<b>Test User</b> created a HabaPay account",
        "type": "create_account",
        "timestamp": "4 September 2023, 7:07 AM"
      }
    ]
  }
}
```

### Users Recent Activity

**Endpoint** `GET /api/v1/admins/users/activity`

#### Description

Get recent activity overview for all users

#### Query Parameters

- `page` (integer, optional): start page e.g. `?page=1`
- `per_page`(integer, optional): number of records to display e.g. `&per_page=3`

#### Success Sample Response

```json
{
  "success": true,
  "message": "Users Recent Activity",
  "data": {
    "page": 1,
    "total": 9,
    "per_page": 10,
    "previous_page": null,
    "next_page": null,
    "last_page": 1,
    "data": [
      {
        "id": 9,
        "user_id": 3,
        "message": "<b>Dev</b> sent Ksh 25 to </b>Test User</b>",
        "type": "send",
        "timestamp": "5 September 2023, 3:40 PM"
      },
      {
        "id": 7,
        "user_id": 3,
        "message": "<b>Dev</b> sent Ksh 30 to </b>Test User</b>",
        "type": "send",
        "timestamp": "5 September 2023, 1:31 PM"
      },
      {
        "id": 5,
        "user_id": 3,
        "message": "<b>Dev</b> sent Ksh 20.4 to </b>Test User</b>",
        "type": "send",
        "timestamp": "5 September 2023, 1:31 PM"
      },
      {
        "id": 4,
        "user_id": 3,
        "message": "<b/>Dev</b> deposited Ksh 500 to wallet",
        "type": "deposit",
        "timestamp": "5 September 2023, 1:30 PM"
      }
    ]
  }
}
```

### Suspend User Account

**Endpoint**: `POST /api/v1/admins/users/{id}/suspend`

#### Description

Suspend user account with the given user id

#### Route Parameters

- `id` (integer, required):- UserId of the account to suspend

#### Success Sample Response

```json
{
  "success": true,
  "message": "User account suspended successfully"
}
```

### Unsuspend User Account

**Endpoint**: `POST /api/v1/admins/users/{id}/unsuspend`

#### Description

Unsuspend user account associated with the given id

#### Route Parameters

- `id` (integer, require):- User id of the account to unsuspend

#### Success Sample Response

```json
{
  "success": true,
  "message": "User account re-activated successfully."
}
```

### Delete User Account

**Endpoint**: `DELETE /api/v1/admins/users/{id}`

#### Description

Delete user account and all associated user data.

#### Route Params

- `id` (integer, required):- User id to delete account for

#### Success Sample Response

```json
{
  "success": true,
  "message": "User account deleted successfully"
}
```

### Update User Account

**Endpoint**: `PUT /api/v1/admins/users/{id}`

#### Description

Update user account information

#### Route Params

- `id` (integer, required):- User id to delete account for

#### Request body

[Same as the one provided here](#register-admin)

#### Success Sample Response

```json
{
  "success": true,
  "message": "User account updated successfully"
}
```

## Analytics

### Analytics Overview

**Endpoint**: `GET /api/v1/analytics/overview`

#### Description

Get an overview of the system analytics including total transactions, registered users and total transactions.

#### Success Sample Response

```json
{
  "success": true,
  "message": "Analytics retrieved successfully",
  "data": {
    "weekly_transactions": {
      "total": 7,
      "percentage": 5
    },
    "weekly_signups": {
      "total": 5,
      "percentage": 3
    },
    "weekly_exchanges": {
      "total": 3,
      "percentage": 2
    },
    "national_reach": {
      "total_users": 4,
      "total_counties": 1
    }
  }
}
```

### Analytics Recent Activity

**Endpoint**: `GET /api/v1/analytics/activity`

#### Description

Get an overview of recent activity e.g. total app launches, user balance etc.

### Query Parameters

- `page` (integer, optional): start page e.g. `?page=1`
- `per_page`(integer, optional): number of records to display e.g. `&per_page=3`

#### Success Sample Response

```json
{
  "success": true,
  "message": "Recent activity retrieved successfully",
  "data": {
    "page": 1,
    "total": 3,
    "per_page": 10,
    "previous_page": null,
    "next_page": null,
    "last_page": 1,
    "data": [
      {
        "user_id": 1,
        "username": "Angel3",
        "balance": 0,
        "total_transactions": 0,
        "app_launches": 0,
        "status": "Active"
      },
      {
        "user_id": 2,
        "username": "Test User",
        "balance": 121,
        "total_transactions": 1,
        "app_launches": 0,
        "status": "Active"
      },
      {
        "user_id": 3,
        "username": "Dev",
        "balance": 379,
        "total_transactions": 8,
        "app_launches": 0,
        "status": "Active"
      }
    ]
  }
}
```
