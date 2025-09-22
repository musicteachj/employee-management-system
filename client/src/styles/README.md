# Centralized Styles

This folder contains the centralized CSS styles for the Employee Management System. The styles are organized into modular files for better maintainability and reusability.

## File Structure

- **`index.css`** - Main entry point that imports all other style files
- **`cards.css`** - Card component styles (header-card, summary-card, section-card, etc.)
- **`forms.css`** - Form-related styles (form fields, validation, section headers)
- **`components.css`** - Component-specific styles (tables, buttons, chips, dividers)
- **`utilities.css`** - Utility classes and layout helpers

## Usage

The styles are automatically imported in `main.ts` and are available globally throughout the application.

### Common Card Classes

- `.header-card` - Page header cards with gradient background
- `.summary-card` - Summary/metric cards with hover effects
- `.section-card` - Form section cards with primary color accents
- `.chart-card` - Chart container cards
- `.info-card` - Information display cards
- `.filters-card` - Filter/search container cards
- `.table-card` - Table container cards
- `.main-form-card` - Main form wrapper cards

### Form Classes

- `.form-field` - Standard form field styling
- `.search-field` - Search input styling
- `.filter-field` - Filter dropdown styling
- `.section-header` - Section header styling with primary colors

### Component Classes

- `.divider-gradient` - Gradient divider lines
- `.action-btn` - Action button styling with hover effects
- `.empty-state` - Empty state containers

### Utility Classes

- `.gap-3` - 12px gap spacing
- `.transition-all` - Standard transition timing
- `.shadow-light`, `.shadow-medium`, `.shadow-heavy` - Shadow utilities
- Color utilities (`.text-primary`, `.bg-primary-light`, etc.)

## Customization

To add new styles:

1. Add component-specific styles to the appropriate file
2. For new categories, create a new CSS file and import it in `index.css`
3. Use CSS custom properties for consistent theming
4. Follow the existing naming conventions

## Migration Notes

All Vue components have been updated to use these centralized styles instead of duplicated scoped styles. Component-specific styles should only be added when they are truly unique to that component.
