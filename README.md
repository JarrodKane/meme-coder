# Code Meme Generator App

This is a Code meme generator app that's using OpenAI.
The app also utilizes the following libraries:

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [html-to-image](https://github.com/bubkoo/html-to-image) to create the images from the code
- [daisyui](https://daisyui.com/) for UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling

![Image of the Meme code logo](https://github.com/JarrodKane/meme-coder/blob/fd9a14f2ed3201355a6990adba063f3d22021952/public/meme.png)

## Setup

1. If you don’t have Node.js installed, [install it from here](https://nodejs.org/en/) (Node.js version >= 14.6.0 required)

2. Clone this repository

3. Navigate into the project directory

   ```bash
   $ cd meme-coder
   ```

4. Install the requirements

   ```bash
   $ npm install
   ```

5. Make a copy of the example environment variables file

   On Linux systems:

   ```bash
   $ cp .env.example .env
   ```

   On Windows:

   ```powershell
   $ copy .env.example .env
   ```

6. Add your [API key](https://platform.openai.com/account/api-keys) to the newly created `.env` file

7. Run the app

   ```bash
   $ npm run dev
   ```

You should now be able to access the app at [http://localhost:3000](http://localhost:3000)! For the full context behind this example app, check out the [tutorial](https://platform.openai.com/docs/quickstart).
