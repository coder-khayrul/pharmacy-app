# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

## Firebase authentication setup

Email/password login and password resets use Firebase Authentication. Signup requests a 6-digit email code from the Express API; only after the code is verified does the app create the Firebase account. The API uses Firebase Admin to mark the Firebase account as email-verified. Firebase client config is public; the Admin service-account key and SMTP credentials must stay on the server.

1. In Firebase Console, enable **Authentication → Sign-in method → Email/Password**.
2. Create a Firebase service account in **Project settings → Service accounts** and generate a private key. In Google Cloud Console → **IAM**, grant that service account the **Firebase Authentication Admin** role (`roles/firebaseauth.admin`) on this same project. Keep the downloaded key secret; never paste it into chat or commit it.
3. Create/configure SMTP credentials for sending signup codes.
4. Copy `server/pharmacy-app-server/.env.example` to `server/pharmacy-app-server/.env`. Set `MONGODB_URI`, a long random `JWT_SECRET`, `FIREBASE_PROJECT_ID`, `FIREBASE_SERVICE_ACCOUNT_JSON` (the full service-account JSON on one line, with private-key newlines represented as `\n`), and all `SMTP_*` values. MongoDB stores short-lived, hashed OTP challenges; codes expire after 10 minutes and allow at most five attempts. If `FIREBASE_SERVICE_ACCOUNT_JSON` is missing, the API falls back to Google Application Default Credentials; on a local machine, configure those credentials or provide the service-account JSON, otherwise signup code requests cannot check Firebase users.
5. Start the API from `server/pharmacy-app-server` with `npm install` and `npm run dev`.
6. Leave `EXPO_PUBLIC_API_URL` unset during development: the app derives the API host from Expo's dev server for phone testing and uses the current web host for web. If you need an override, set `http://<your-computer-lan-ip>:4000/api` on a physical phone, `http://localhost:4000/api` for web/iOS simulator, or `http://10.0.2.2:4000/api` for an Android emulator.
7. Start Expo from `pharmacy-app` with `npm start`.

Never commit either `.env` file or the Firebase service-account JSON. Firebase password reset emails are sent directly by Firebase Authentication.

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
