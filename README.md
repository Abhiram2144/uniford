
## Getting Started

First use   ``` npm install``` to set up the npm 

Then install the dependencies by using the following commands : 
```
npm i bcryptjs next-auth @emailjs/browser mongoose
npm i --save-dev @types/bcryptjs
```
You need to create .env file and it should contain:
```
GOOGLE_CLIENT_ID 
GOOGLE_CLIENT_SECRET 

NEXTAUTH_SECRET 
NEXTAUTH_URL = http://localhost:3000

MONGO_URL 
EMAIL_USER 
EMAIL_PASS 

NEXT_PUBLIC_EMAILJS_USER_ID 
NEXT_PUBLIC_EMAILJS_SIGNUP_TEMPLATE_ID 
NEXT_PUBLIC_EMAILJS_SERVICE_ID 
NEXT_PUBLIC_EMAILJS_LOGIN_TEMPLATE_ID 
```

Now run ```npm run dev``` to start the website

Whenever a user logs in or signs up, an email will be sent using EmailJS. It might take some time so be patient

Deployed Link : https://uniford-eosin.vercel.app/

