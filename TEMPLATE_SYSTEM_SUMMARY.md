# Template System Implementation Summary

## Overview
The template system in this Laravel 12 application implements a flexible template architecture that allows store owners to use either shared templates across branches or independent custom templates for each branch.

## Database Structure

### Main Tables:
- **templates**: Stores base templates with `name`, `slug`, `html_content`, `css_content`, and metadata
- **template_blocks**: Defines components within templates (blocks with type, label, config schema, etc.)
- **theme_presets**: Color schemes for templates with CSS variables
- **branch_templates**: Links branches to templates with sync capabilities

## Core Components

### Models:
1. **Template** - Main template definition with HTML/CSS content
2. **TemplateBlock** - Individual components within a template  
3. **ThemePreset** - Color schemes for templates
4. **BranchTemplate** - Links branches to templates with sync status

### Services:
- **BranchTemplateService** - Manages creation, cloning, synchronization of branch templates
- **PropagateBranchTemplateChanges** - Job that updates synced branches when source templates change

### Controllers:
- **BranchTemplateController** - API endpoints for managing branch-specific templates
- Handles CRUD operations including sync settings

## Template Relationships & Synchronization

### Branch-Template Relationship:
- Each `store_branch` has one associated `BranchTemplate`
- `BranchTemplate` links to a `template_id` (the actual template) 
- For synced templates, maintains `source_template_id` to track the origin

### Sync Mechanism:
1. **Independent Templates**: Each branch maintains its own copy (`is_synced = false`)
2. **Synchronized Templates**: Branches linked to source template (`is_synced = true`)
3. **Automatic Propagation**: Uses `PropagateBranchTemplateChanges` job when source templates change
4. **Manual Sync Toggle**: `toggleSync()` method handles switching between sync modes

### Template Inheritance:
- Templates can be cloned from one branch to another using `cloneToBranch()`
- Templates can be duplicated with `duplicateTemplate()` method
- Source tracking maintained via `source_template_id` field

## How Changes Propagate:

1. When a template is updated in the system, if any branches are synced to it:
   - The `PropagateBranchTemplateChanges` job is dispatched
   - This job finds all branches that reference this source template
   - It creates new copies of the template content for each synced branch
   - Branches now have independent copies but maintain their sync relationship

2. When turning off sync on a branch:
   - The system clones current source content into an independent copy
   - The branch then maintains its own template without automatic updates

## Usage in Frontend:

Templates are used in public endpoints where:
- Templates with `has_react_component = true` use React components
- Templates with `has_react_component = false` use raw HTML/CSS content from `html_content` and `css_content`
- The system supports both direct template usage and custom page building

## Key Features:

1. **Template Management**: Admin can create, update, delete templates
2. **Template Blocks**: Components that make up templates (with configuration schemas)
3. **Theme Presets**: Color schemes with CSS variables for consistent theming
4. **Branch Templates**: Per-branch template settings and sync status
5. **Template Cloning**: Copy templates between branches or create independent copies
6. **Template Import/Export**: Backup and duplication capabilities

## API Endpoints:

- `/branches/{branch}/template` - Get/set branch template
- `/branches/{branch}/template/sync` - Toggle sync status  
- `/branches/{branch}/template/clone` - Clone another branch's template
- `/branches/{branch}/template/export` - Export template as JSON
- `/branches/{branch}/template/import` - Import previously exported template

This system provides flexibility for store owners to maintain consistent branding across branches while allowing customization when needed.