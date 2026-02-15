# Contributing to MAXIMUS AI Assistant

Thank you for your interest in contributing to MAXIMUS! This guide will help you get started.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose (optional)
- Git

### Setup Development Environment

1. **Fork and clone the repository:**
```bash
git clone https://github.com/YOUR_USERNAME/MAXIMUS.git
cd MAXIMUS
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment:**
```bash
cp .env.example .env
# Edit .env as needed
```

4. **Start development server:**
```bash
npm run dev
```

## Project Structure

```
MAXIMUS/
├── src/
│   ├── server.js           # Main server
│   ├── routes/             # API routes
│   └── services/           # Business logic
├── public/                 # Frontend files
├── helm/                   # Kubernetes charts
├── dashboard/              # Nginx proxy
├── PERSONALITY.md          # AI personality
└── docs/                   # Documentation
```

## Making Changes

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation changes
- `refactor/description` - Code refactoring

### Commit Messages

Follow conventional commits:
```
feat: Add new personality trait system
fix: Resolve memory leak in chat service
docs: Update API documentation
refactor: Improve lead service performance
```

### Code Style

- Use 2 spaces for indentation
- Use camelCase for variables and functions
- Use PascalCase for classes
- Add comments for complex logic
- Keep functions small and focused

### Testing

Before submitting:

1. **Test locally:**
```bash
npm start
# Verify all features work
```

2. **Test with Docker:**
```bash
docker-compose up
# Check all services start correctly
```

3. **Check for security issues:**
```bash
npm audit
```

## Submitting Changes

### Pull Request Process

1. **Update your fork:**
```bash
git checkout main
git pull upstream main
```

2. **Create a feature branch:**
```bash
git checkout -b feature/my-feature
```

3. **Make your changes and commit:**
```bash
git add .
git commit -m "feat: Add my feature"
```

4. **Push to your fork:**
```bash
git push origin feature/my-feature
```

5. **Create a Pull Request:**
- Go to the repository on GitHub
- Click "New Pull Request"
- Select your branch
- Fill in the PR template
- Submit for review

### Pull Request Guidelines

- Provide a clear description of changes
- Reference any related issues
- Include screenshots for UI changes
- Ensure all tests pass
- Keep PRs focused on a single feature/fix
- Update documentation as needed

## Areas for Contribution

### High Priority

- [ ] Full Telegram bot integration
- [ ] Full WhatsApp integration
- [ ] User authentication system
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

### Medium Priority

- [ ] Email notifications
- [ ] Webhook support
- [ ] Plugin system
- [ ] Advanced AI model fine-tuning
- [ ] Export/import functionality

### Documentation

- [ ] Video tutorials
- [ ] More examples
- [ ] API client libraries
- [ ] Troubleshooting guides

### Testing

- [ ] Unit tests for services
- [ ] Integration tests
- [ ] E2E tests for frontend
- [ ] Load testing

## Development Tips

### Debugging

Enable debug logs:
```bash
DEBUG=* npm start
```

### Hot Reload

Use nodemon for development:
```bash
npm run dev
```

### Database Changes

When modifying lead storage, ensure backward compatibility.

### AI Model Testing

Test with both Ollama and DeepSeek:
```bash
# Test Ollama
AI_PROVIDER=ollama npm start

# Test DeepSeek
AI_PROVIDER=deepseek DEEPSEEK_API_KEY=your_key npm start
```

## Common Issues

### Port Already in Use

```bash
lsof -ti:3000 | xargs kill -9
```

### Docker Build Fails

```bash
docker system prune -a
docker-compose build --no-cache
```

### Dependencies Issues

```bash
rm -rf node_modules package-lock.json
npm install
```

## Getting Help

- **Issues:** Search existing issues or create a new one
- **Discussions:** Use GitHub Discussions for questions
- **Discord:** Join our community (link TBD)

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.

## Recognition

Contributors will be recognized in:
- README.md
- Release notes
- Project website

Thank you for contributing to MAXIMUS! 🎉
