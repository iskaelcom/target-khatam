# Contributing to Target Khatam

Thank you for considering contributing to Target Khatam! 🙏

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please be respectful and constructive in all interactions.

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (OS, browser, app version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear use case** - Why is this enhancement needed?
- **Detailed description** - How should it work?
- **Mockups/wireframes** if applicable

### Pull Requests

We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code lints
5. Issue the pull request

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Setup Steps

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/your-username/target-khatam.git
   cd target-khatam
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run web    # For web
   npm run ios    # For iOS
   npm run android # For Android
   ```

4. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

## 💻 Coding Standards

### TypeScript

- Use TypeScript for all new files
- Define proper types/interfaces - avoid `any`
- Use functional components with hooks

### File Organization

```
app/          # Screens (Expo Router file-based routing)
components/   # Reusable UI components
context/      # React Context providers
services/     # Business logic & data services
utils/        # Helper functions
types/        # TypeScript type definitions
i18n/         # Translations
```

### Component Structure

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './ComponentName.styles';

interface ComponentNameProps {
  title: string;
  onPress?: () => void;
}

export function ComponentName({ title, onPress }: ComponentNameProps) {
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
}
```

### Styling

- Use `StyleSheet.create()` for styles
- Keep styles in the same file or separate `.styles.ts` file
- Use theme constants from `constants/Colors.ts`

### Naming Conventions

- **Components**: PascalCase (`HomeScreen.tsx`, `ProgressCard.tsx`)
- **Files**: camelCase for utilities (`storageService.ts`)
- **Functions**: camelCase (`calculateProgress()`)
- **Constants**: UPPER_SNAKE_CASE (`TOTAL_PAGES`)
- **Types/Interfaces**: PascalCase (`ProgressData`, `JuzStatus`)

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(progress): add juz completion animation
fix(storage): resolve data persistence issue
docs(readme): update installation instructions
```

## 🔄 Pull Request Process

1. **Update documentation** if you changed functionality
2. **Add tests** for new features
3. **Update the README.md** if needed
4. **Ensure all tests pass**: `npm run lint`
5. **Update i18n files** if you added new text strings
6. **Include screenshots** for UI changes

### PR Title Format

Follow the same format as commit messages:

```
feat(scope): brief description of changes
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review
- [ ] I have commented my code where needed
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests
- [ ] All tests pass locally
```

## 🌍 Internationalization (i18n)

When adding new text strings:

1. Add the key to `i18n/en.ts` (English - source of truth)
2. Add translation to `i18n/id.ts` (Indonesian)
3. Use the translation in your component:

```typescript
import { useLanguage } from '@/context/LanguageContext';

const { t } = useLanguage();
<Text>{t.home.title}</Text>
```

## 🧪 Testing

- Write unit tests for utility functions
- Test components with different states
- Verify on both iOS and Android if possible
- Test in both languages (English and Indonesian)

## 📱 Platform-Specific Code

When writing platform-specific code:

```typescript
import { Platform } from 'react-native';

const padding = Platform.select({
  ios: 20,
  android: 16,
  web: 24,
});
```

## ❓ Questions?

Feel free to:
- Open an issue for questions
- Reach out to maintainers
- Check existing documentation

## 🙏 Thank You!

Every contribution, no matter how small, is appreciated. Thank you for helping make Target Khatam better!

---

**BarakAllahu fiikum!** 🤲
