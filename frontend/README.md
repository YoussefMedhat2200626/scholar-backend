# Scholar

Scholar is a professional research and academic management platform built with Next.js, Prisma, and Supabase. It provides a robust foundation for managing academic data, user profiles, and research projects.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **ORM**: [Prisma 7](https://www.prisma.io/)
- **Styling**: Vanilla CSS / Tailwind CSS 4
- **Auth**: Better Auth (Integrated)

---

## 🛠️ Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js**: v20 or higher (LTS recommended)
- **Package Manager**: [npm](https://www.npmjs.com/) (standard)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Marwan-Mamdouh/scholar.git
   cd scholar
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Database Setup**:
   Generate the Prisma client to match the schema:
   ```bash
   npx prisma generate
   ```

### 🔐 Environment Configuration

> [!IMPORTANT]
> This project **cannot run** without a valid environment configuration. For security reasons, sensitive keys and database URLs are not shared publicly.

1. Create a `.env` file in the root directory.
2. Follow the structure below (keys only):

```env
# Prisma & Database
DEV_DB=""
DIRECT_URL=""

# Authentication
BETTER_AUTH_SECRET=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# AI & Third-Party Services
GEMINI_API_KEY=""
S2_API_KEY=""

# Supabase
SUPABASE_URL=""
SUPABASE_ANON_KEY=""
```

#### Requesting Access

If you are a contributor, please reach out to the project maintainer to obtain the necessary environment variables:

- **Maintainer**: Marwan Mamdouh
- **Email**: [marwanabdalmagied@gmail.com](mailto:marwanabdalmagied@gmail.com)

---

## 🏃 Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🤝 Contribution Guidelines

We welcome contributions! To maintain code quality and consistency, please follow these guidelines:

### Branching Strategy

- **Feature**: `feature/short-description` (e.g., `feature/auth-login`)
- **Bug Fix**: `fix/short-description` (e.g., `fix/header-overflow`)
- **Documentation**: `docs/short-description`

### Commit Practices

- **Atomic Commits**: Keep commits focused on a single change or logical group of changes.
- **Clear Messages**: Use descriptive commit messages (e.g., `feat: add user profile schema`).
- **PR Structure**: A Pull Request should ideally contain multiple well-structured commits that tell a story of the implementation, rather than one giant "squashed" commit.

---

## 📧 Contact

For any questions, feedback, or to request access to the development environment:

- **Email**: [marwanabdalmagied@gmail.com](mailto:marwanabdalmagied@gmail.com)
- **GitHub**: [@Marwan-Mamdouh](https://github.com/Marwan-Mamdouh)
