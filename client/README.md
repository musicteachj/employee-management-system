# Employee Management System

A comprehensive Vue 3 application for managing employee data, performance reviews, organizational structure, and HR operations.

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd employee-management-system/client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Build for production**

   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

The application will be available at `http://localhost:5173` (or the next available port).

## ✨ Features

### 👥 Employee Management

- **Employee Profiles**: Comprehensive employee records with personal, employment, and compensation information
- **Add New Employees**: Streamlined employee onboarding with form validation
- **Edit Employee Records**: Update employee information with audit trail
- **Employee Search**: Advanced search functionality across multiple employee fields
- **Bulk Operations**: Perform actions on multiple employees simultaneously

### 📊 Organizational Views

- **Data Tables**: Sortable, filterable employee listings with pagination
- **Accordion Views**: Grouped employee data by manager, department, or status
- **Organization Chart**: Interactive hierarchical view of reporting relationships
- **Recent Hires**: Track newly hired employees (last 30 days)
- **Unassigned Hires**: Identify employees without assigned managers

### 🎯 Performance Management

- **Performance Reviews**: Schedule, conduct, and track employee performance reviews
- **Performance Analytics**: Visual insights into team and individual performance
- **Review Status Tracking**: Monitor overdue and upcoming performance reviews
- **Performance History**: Maintain historical performance data

### 📈 Analytics & Reporting

- **Department Analytics**: Department comparison and distribution charts
- **Employment Status Charts**: Visual breakdown of employee status
- **Hiring Trends**: Track hiring patterns over time
- **Job Level Distribution**: Analyze organizational structure by job levels
- **Salary Distribution**: Compensation analysis and insights
- **Performance Trends**: Track performance metrics over time

### 🔧 HR Operations

- **Manager Assignment**: Assign or reassign managers to employees
- **Employment Type Conversion**: Convert between full-time, part-time, and contract
- **Status Changes**: Update employee status (active, inactive, terminated)
- **Training Status Updates**: Track employee training completion
- **Employee Rehiring**: Process for rehiring former employees

### 📋 Employee Categories

- **Active Employees**: Current workforce management
- **Contract Employees**: Specialized view for contract workers
- **Former Employees**: Historical employee records
- **By Department**: Department-based employee grouping
- **By Manager**: Manager-based employee organization
- **By Status**: Status-based employee filtering

### 🛠 Technical Features

- **Responsive Design**: Mobile-friendly interface using Vuetify
- **Form Validation**: Comprehensive validation using Vee-Validate and Zod
- **State Management**: Centralized state management with Pinia
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Material Design components with Vuetify
- **Charts & Visualizations**: Interactive charts using Chart.js and Vue-ChartJS

## 🏗 Technology Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Type System**: TypeScript
- **Build Tool**: Vite
- **UI Framework**: Vuetify 3 (Material Design)
- **State Management**: Pinia
- **Form Validation**: Vee-Validate + Zod
- **Charts**: Chart.js + Vue-ChartJS
- **Date Handling**: Day.js
- **Icons**: Material Design Icons (@mdi/font)
- **Routing**: Vue Router 4

## 📋 TODO

### Quick Wins (High Impact, Low Effort):

- [ ] Add comprehensive README with screenshots, setup instructions, and feature list
- [ ] Environment variables for configuration
- [ ] Error boundaries and proper error handling
- [ ] Loading states and skeleton screens
- [ ] Data validation with proper error messages
- [ ] Responsive design improvements
- [ ] Dark mode toggle
- [ ] Export functionality (CSV, PDF)

### Recommended Priority Order:

1. **Backend + JWT Auth** (Most important for demonstrating full-stack skills)
2. **Database integration** with proper data persistence
3. **Comprehensive testing suite**
4. **Docker + CI/CD pipeline**
5. **Advanced analytics and reporting**
6. **Real-time features**
7. **Mobile optimization**
