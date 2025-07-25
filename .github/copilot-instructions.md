# Dynamic UI Builder - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a dynamic UI builder application that serves as an alternative to Retool. It consists of:

1. **Frontend**: Vite + React + TypeScript with drag-and-drop UI building capabilities
2. **Backend**: Java Spring Boot REST API for data management and component persistence

## Architecture
- **Frontend**: Uses React with TypeScript, Tailwind CSS for styling, @tanstack/react-table for data tables, @dnd-kit for drag-and-drop, and Zustand for state management
- **Backend**: Spring Boot with JPA/Hibernate, H2 database for development, RESTful APIs
- **Key Features**: Dynamic component system, data binding, visual UI builder, dataset management

## Code Style Guidelines
- Use TypeScript with strict typing
- Follow React functional component patterns with hooks
- Use Tailwind CSS for styling
- Implement proper error handling and loading states
- Use consistent naming conventions for components and variables

## Component Structure
- Each UI component should be reusable and configurable
- Components should accept props for customization
- Use the established component registry pattern for dynamic rendering
- Implement proper TypeScript interfaces for all data structures

## Backend Patterns
- Follow REST API conventions
- Use proper HTTP status codes
- Implement CORS for frontend integration
- Use JPA entities with proper relationships
- Follow Spring Boot best practices for service layers
