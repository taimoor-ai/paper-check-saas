# Frontend - Folder Structure

## Source Directory (`src/`)

```
src/
├── App.css
├── App.jsx
├── index.css
├── main.jsx
├── assets/
├── components/
│   ├── auth/
│   │   ├── AuthCard.jsx
│   │   ├── AuthLayout.jsx
│   │   ├── Button.jsx
│   │   ├── Divider.jsx
│   │   ├── InputField.jsx
│   │   ├── OTPInput.jsx
│   │   ├── PasswordField.jsx
│   │   └── SocialButton.jsx
│   └── landing/
│       ├── CTASection.jsx
│       ├── DemoSection.jsx
│       ├── FAQSection.jsx
│       ├── FeaturesSection.jsx
│       ├── Footer.jsx
│       ├── HeroSection.jsx
│       ├── HowItWorksSection.jsx
│       ├── LandingPage.jsx
│       ├── Navbar.jsx
│       ├── PricingSection.jsx
│       ├── StatsBanner.jsx
│       └── TestimonialsSection.jsx
├── lib/
│   └── api.js
├── pages/
│   ├── ForgotPassword.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ResetPassword.jsx
│   └── VerifyEmail.jsx
└── styles/
    └── auth-theme.js
```

### Directory Overview

- **components/**: Reusable UI components organized by feature
  - **auth/**: Authentication-related components
  - **landing/**: Landing page components
- **lib/**: JavaScript utilities and helpers (API calls)
- **pages/**: Page-level components
- **styles/**: Theme and styling configuration
- **assets/**: Static assets (images, icons, etc.)
