# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Keyboard Shortcuts Modal**: Press '?' to view available keyboard shortcuts for efficient navigation
- **Advanced Game Filtering**: 
  - Search games by opponent username
  - Filter by result (win, loss, draw)
  - Filter by time control (bullet, blitz, rapid, daily)
- **Opening Detection**: Automatically detects and displays chess opening names with ECO codes
- **Export Functionality**:
  - Download game PGN files
  - Copy PGN to clipboard
  - Export game analysis with AI feedback
- **Theme Toggle**: Visible theme switcher button with persistent localStorage
- **Enhanced Keyboard Navigation**:
  - Arrow keys for move navigation
  - 'F' key to flip board
  - 'Esc' to close modals
  - '?' for help
- **Opening Information**: View opening descriptions and strategic ideas

### Fixed
- Fixed all ESLint errors and type issues
- Removed unused variables and imports
- Fixed React Hooks dependency warnings
- Improved type safety across components
- Fixed empty interface type declarations

### Changed
- Updated vulnerable dependencies (axios, react-router-dom, @babel packages)
- Reduced security vulnerabilities from 14 to 8
- Enhanced error handling and user feedback
- Improved form validation in search component
- Better loading states and user experience
- More consistent code formatting and style

### Improved
- Better accessibility with ARIA labels
- Enhanced mobile responsiveness
- Improved component organization
- Better error messages and user guidance
- More intuitive UI interactions
