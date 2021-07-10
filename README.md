# Amusement Park Backend

A fully functional backend for imaginary amusement park.

## Background

This repository is a part of one of my school projects I made during the past school year.\
Our task was to create a website with a backend and an ai powered bot. Also, we had to work in agile method with a small help of Jira software. We also decided to use Bitbucket for storing our Git repo.

## Technologies

I decided to go with **Node.js** and used **Express.js** framework as it is something I had already knew.
We were forced to use **MongoDB** as our database. We had decided to create a professional and flexible login system, so we have used **Passport.js** to carry out this task.
We also wanted to send email messages (for example for email address confirmation), so we have used **Nodemailer** together with **EJS** for creating templates.

## How does this work

Unfortunately, I have stopped updating a documentation after first some days, so I cannot provide it. Also, I do not have enough time now to write the documentation from scratch. This code, however, is quite simple and self-explanatory and I hope you will get how it works.

The only thing I want to explain is how the sign-up works as it may be a little tricky. Firstly, a user sends their email address and they get back a message with a token and a link. When the user clicks on the link, they must type in a password. After going ahead an account is created.

## Security note

This app was created as a school project and **IS NOT INTENDED TO BE SAFE**. You use it **ON YOUR OWN RISK**.\
Please do not use it as a learning resource of any kind.

_Side note_:\
There is an `.env` file present in the project, however it does not hold any sensitive data. SMTP Client credentials are used for logging-in into a fake SMTP service called [Ethereal](https://ethereal.email/). Every message sent from the code is being caught by the service and is removed after some hours.
