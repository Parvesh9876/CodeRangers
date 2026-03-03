🚀 Code Rangers Club Management System (CRMS)

Backend API Documentation
Built with: Node.js + Express + TypeScript + MongoDB

🌐 Base URL
http://localhost:5000/api
🔐 Authentication APIs
1. Register User

Endpoint

POST /auth/register

Description

Creates a new user account.

Request Body (JSON)

{
  "name": "Parvesh Soni",
  "email": "user@example.com",
  "password": "123456"
}

Required Fields

Field	Type	  Required	Validation Rule
name	string	   Yes	    Minimum 2 characters
email	string	Yes	Valid email format
password	string	Yes	Minimum 6 characters

Success Response (201)

{
  "token": "JWT_TOKEN",
  "user": {
    "_id": "userId",
    "name": "Parvesh Soni",
    "email": "user@example.com",
    "role": "user"
  }
}

Error Responses

400 → User already exists

500 → Server error

2. Login User

Endpoint

POST /auth/login

Request Body

{
  "email": "user@example.com",
  "password": "123456"
}

Required Fields

Field	Type	Required
email	string	Yes
password	string	Yes

Success Response (200)

{
  "token": "JWT_TOKEN",
  "user": {
    "_id": "userId",
    "name": "Parvesh",
    "email": "user@example.com",
    "role": "user"
  }
}

Error Responses

400 → Invalid credentials

500 → Server error

👤 User APIs
3. Get Logged-in User Profile

Endpoint

GET /user/profile

Headers (Required)

Authorization: Bearer JWT_TOKEN

Success Response (200)

{
  "_id": "userId",
  "name": "Parvesh",
  "email": "user@example.com",
  "role": "user"
}

Error Responses

401 → No token / invalid token

📅 Event Management APIs
4. Create Event (Admin Only)

Endpoint

POST /events

Headers

Authorization: Bearer JWT_TOKEN

Request Body

{
  "title": "Code Rangers Hackathon",
  "description": "24-hour coding event",
  "date": "2026-04-15",
  "location": "College Auditorium",
  "image": "image-url"
}

Required Fields

Field	      Type	    Required	 Limit
title	     string	      Yes	 Max 100 characters
description	 string	      Yes	Max 1000 characters
date	     string	      Yes	ISO date format
location	 string	      Yes	Max 100 characters
image	     string	      No	URL

Success Response (201)

{
  "message": "Event created successfully",
  "event": {
    "_id": "eventId",
    "title": "Code Rangers Hackathon",
    "description": "24-hour coding event",
    "date": "2026-04-15",
    "location": "College Auditorium",
    "image": "image-url"
  }
}

Error Responses

401 → Unauthorized

403 → Admin only

500 → Server error

5. Get All Events (Public)

Endpoint

GET /events

Optional Query Parameters

?page=1
&limit=10
&search=hackathon

Pagination Rules

Parameter	Default	Maximum
page	1	—
limit	10	50

Success Response

{
  "total": 20,
  "page": 1,
  "limit": 10,
  "events": [
    {
      "_id": "eventId",
      "title": "Hackathon",
      "description": "Event description",
      "date": "2026-04-15",
      "location": "Auditorium"
    }
  ]
}
6. Get Single Event

Endpoint

GET /events/:id

Success Response

{
  "_id": "eventId",
  "title": "Hackathon",
  "description": "Event description",
  "date": "2026-04-15",
  "location": "Auditorium",
  "image": "image-url"
}

Error Responses

404 → Event not found

7. Update Event (Admin Only)

Endpoint

PUT /events/:id

Headers

Authorization: Bearer JWT_TOKEN

Request Body (Send only fields to update)

{
  "title": "Updated Title",
  "location": "New Location"
}

Error Responses

401 → Unauthorized

403 → Admin only

404 → Event not found

8. Delete Event (Admin Only)

Endpoint

DELETE /events/:id

Headers

Authorization: Bearer JWT_TOKEN

Success Response

{
  "message": "Event deleted successfully"
}

Error Responses

401 → Unauthorized

403 → Admin only

404 → Event not found

🔐 Authorization Rules
Action	        User	Admin
Register	     Yes	Yes
Login	         Yes	Yes
View Events	     Yes	Yes
Create Event	  No	Yes
Update Event	  No	Yes
Delete Event	  No	Yes
🛡 Security Rules

Passwords are hashed using bcrypt.

JWT expires in 7 days.

Authorization required for protected routes.

Maximum pagination limit: 50 items per request.