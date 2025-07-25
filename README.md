# Dynamic UI Builder

A powerful alternative to Retool for building dynamic user interfaces with drag-and-drop functionality, built with Vite + React + TypeScript frontend and Java Spring Boot backend.

## Features

- **Drag & Drop UI Builder**: Visual interface for building applications
- **Dynamic Components**: Table, Form, Chart, Button, Text, Card components
- **Data Integration**: Connect components to datasets with real-time updates
- **Component Properties**: Configurable properties panel for each component
- **Preview Mode**: Switch between builder and preview modes
- **REST API Backend**: Java Spring Boot backend for data persistence
- **Type Safety**: Full TypeScript support throughout the application

## Tech Stack

### Frontend
- **Vite** - Fast build tool and development server
- **React 18** - UI library with hooks and functional components
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **@tanstack/react-table** - Powerful data tables
- **@dnd-kit** - Modern drag and drop toolkit
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons

### Backend
- **Java 17** - Programming language
- **Spring Boot 3.2** - Application framework
- **Spring Data JPA** - Data persistence
- **H2 Database** - In-memory database for development
- **Maven** - Dependency management

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Java 17+
- Maven 3.6+

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Run the Spring Boot application
mvn spring-boot:run
```

## Project Structure

```
dynamic-ui/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── Canvas.tsx     # Main canvas for component placement
│   │   ├── ComponentPanel.tsx # Drag source for components
│   │   └── PropertiesPanel.tsx # Component configuration
│   ├── stores/            # State management
│   ├── types/             # TypeScript type definitions
│   └── services/          # API service layer
├── backend/               # Spring Boot backend
│   └── src/main/java/com/dynamicui/
│       ├── model/         # JPA entities
│       ├── repository/    # Data repositories
│       └── controller/    # REST controllers
└── README.md
```

## Usage

1. **Start both servers**: Run the frontend (port 5173) and backend (port 8080)
2. **Build your UI**: Drag components from the left panel onto the canvas
3. **Configure components**: Click on components to open the properties panel
4. **Preview your app**: Toggle between Builder and Preview modes
5. **Data integration**: Connect components to datasets via the backend API

## API Endpoints

### Datasets
- `GET /api/datasets` - Get all datasets
- `POST /api/datasets` - Create a new dataset
- `GET /api/datasets/{id}` - Get dataset by ID
- `PUT /api/datasets/{id}` - Update dataset
- `DELETE /api/datasets/{id}` - Delete dataset

### UI Components
- `GET /api/components` - Get all components
- `POST /api/components` - Create a new component
- `GET /api/components/{id}` - Get component by ID
- `PUT /api/components/{id}` - Update component
- `DELETE /api/components/{id}` - Delete component

## Development

### Adding New Component Types
1. Add the component type to `types/index.ts`
2. Create the component renderer in `Canvas.tsx`
3. Add configuration fields in `PropertiesPanel.tsx`
4. Update the component registry in `ComponentPanel.tsx`

### Extending the Backend
- Add new JPA entities in the `model` package
- Create corresponding repositories in the `repository` package
- Implement REST controllers in the `controller` package

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the MIT License.
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
