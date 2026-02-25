# HR Utils 2026 - Vue SaaS

A modernized, decoupled version of the HR Utils platform, migrated from Laravel 10 to a Vue 3 SPA architecture.

## 🚀 Tech Stack

- **Frontend**: [Vue 3](https://vuejs.org/) (Composition API) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Backend/Auth**: [Supabase](https://supabase.com/)
- **Hosting**: [Cloudflare Pages](https://pages.cloudflare.com/) (SPA mode)

## 📁 Project Structure

- `src/`: Core Vue 3 application logic.
  - `views/`: Page components.
  - `composables/`: Business logic migrated from legacy Laravel controllers.
  - `utils/`: Supabase client and helper utilities.
- `legacy_backend/`: The original Laravel 10 installation kept for logic reference and transition.
- `public/`: Static assets and Cloudflare configuration (`_redirects`).

## 🛠️ Setup & Development

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🌐 Deployment

The project is configured for Cloudflare Pages.
- A `public/_redirects` file is included to handle Single Page Application (SPA) routing (`/* /index.html 200`).
- Ensure all environment variables on Cloudflare start with `VITE_`.

