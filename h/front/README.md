# Vassist - AI Student Support System

An advanced AI-powered student support and communication system built with React, Vite, and Tailwind CSS. Vassist helps students navigate admissions, academics, financial aid, and campus services.

## Features

### 🎓 Core Features
- **Clean, Modern UI** - Built with Tailwind CSS for a professional look
- **"Vassist" Header** - Branding with subtitle "AI-Powered Student Support"
- **Home Page** - Comprehensive university information including:
  - Admissions guidance
  - Academic resources
  - Financial aid information
  - Campus services overview
  - Features and statistics
- **Chat Bot** - AI-powered assistant with:
  - Secure login system (Student ID, Email, Password)
  - Chat interface with AI assistant
  - Suggested questions for users
  - 24/7 availability
  - Personalized student support

### 🎨 UI/UX
- Responsive design (works on desktop, tablet, mobile)
- Smooth transitions and hover effects
- Gradient backgrounds and modern color scheme
- Professional card-based layouts
- Interactive buttons with visual feedback

## Technology Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript (JSX)** - Component language

## Project Structure

```
src/
├── components/
│   ├── Header.jsx      # Navigation header with Vassist branding
│   ├── Home.jsx        # University information and features page
│   ├── ChatBot.jsx     # Login and chat interface
│   └── Footer.jsx      # Footer with links and contact info
├── App.jsx             # Main app component with routing
├── App.css             # Global styles
├── index.css           # Tailwind CSS imports
├── main.jsx            # React entry point
└── assets/             # Static files
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm

### Installation

1. Navigate to the project directory:
   ```bash
  cd h/front
   ```

2. Install dependencies (already done):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and go to:
   ```
   http://localhost:5173/
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)

## Usage

### Home Page
- Welcome message and university information
- Four main service cards (Admissions, Academics, Financial Aid, Campus Services)
- Features section highlighting key benefits
- Statistics showing platform impact

### Chat Bot Page
- **Login Screen**: 
  - Requires Student ID, Email, and Password
  - Demo credentials: STU123456 / student@university.edu
  - Error handling for missing fields
  
- **Chat Interface** (after login):
  - AI assistant welcome message
  - Suggested questions for quick access
  - Message input field for user queries
  - Logout button

### Navigation
- Click **Home** button to view university information
- Click **Chat Bot** button to access the AI assistant
- Clean header with gradient background

## Customization

### Colors
Modify Tailwind CSS classes in components:
- Primary: `from-blue-600 to-blue-800`
- Secondary: `from-green-500 to-green-600`
- Accent colors in service cards

### Content
Update text and images in:
- `components/Home.jsx` - University information
- `components/ChatBot.jsx` - Chat interface
- `components/Header.jsx` - Navigation

### Add More Features
1. Create new component in `src/components/`
2. Import in `App.jsx`
3. Add navigation button in `Header.jsx`
4. Update routing logic in `App.jsx`

## Features Coming Soon
- Real AI integration with backend API
- User authentication system
- Message history and persistence
- Mobile app version
- Email notifications
- Multi-language support

## License
MIT License - feel free to use this project

## Support
For questions or issues, contact: support@vassist.edu

---

Enjoy your Vassist student support system!
