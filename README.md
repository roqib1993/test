# FEGT Weekly Inspection Temperature Reading Application

A comprehensive web application for managing FEGT (Fiber-to-the-Home Equipment and Grounding Test) weekly inspections with temperature reading capture, historical data tracking, and PDF export capabilities.

## Features

✅ **Weekly Inspection Page**
- Enter temperature readings for all 21 FEGT paths
- Form validation & error handling
- Optional notes section for observations
- Clean, intuitive UI with temperature input cards

✅ **Historical Data Page**
- View all past inspection records with pagination
- See inspection date, notes, and temperature readings
- Detailed modal view for each inspection
- **PDF Export** - Download individual inspections as formatted PDF documents
- **CSV Export** - Bulk export all visible records to CSV file

✅ **Path Configuration Page**
- Pre-configured with all 21 paths and their Tx/Rx sensors
- Edit any path's Tx and Rx sensor numbers
- Changes take effect immediately

## Technology Stack

- **Backend**: Node.js + Express.js
- **Frontend**: React 18 + React Router
- **API Communication**: Axios
- **PDF Generation**: PDFKit
- **Styling**: CSS3 (responsive & mobile-friendly)

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### 1. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Start the Application

```bash
# Run both backend and frontend concurrently
npm run dev
```

This will start:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

### Alternative: Run Separately

```bash
# Terminal 1 - Start backend
node server.js

# Terminal 2 - Start frontend
cd client && npm start
```

## Default FEGT Path Configuration

| Path | Tx Sensor | Rx Sensor |
|------|-----------|----------|
| Path-1 | 6 | 1 |
| Path-2 | 7 | 3 |
| Path-3 | 8 | 5 |
| Path-4 | 5 | 2 |
| Path-5 | 9 | 4 |
| ... | ... | ... |
| Path-21 | 25 | 21 |

## API Endpoints

### Paths
- `GET /api/paths` - Get all path configurations
- `PUT /api/paths/:id` - Update a path's Tx and Rx sensors

### Inspections
- `GET /api/inspections` - Get all inspections with pagination
- `GET /api/inspections/:id` - Get single inspection details
- `POST /api/inspections` - Create new inspection
- `GET /api/inspections/:id/pdf` - Download inspection as PDF
- `GET /api/inspections/export/csv` - Export all inspections as CSV

## Usage

### Creating a Weekly Inspection
1. Navigate to "Weekly Inspection" tab
2. Enter temperature readings for each of the 21 paths
3. (Optional) Add notes about observations
4. Click "Save Inspection"

### Viewing Historical Data
1. Navigate to "Historical Data" tab
2. Browse through past inspections
3. Click "View Details" for more information
4. Export individual inspection as PDF or download all as CSV

### Managing Path Configuration
1. Navigate to "Path Configuration" tab
2. Click "Edit" on any path
3. Update Tx and Rx sensor numbers
4. Click "Save" to apply changes

## Data Storage

Currently, the application uses **in-memory storage**. All data will be reset when the server restarts.

### Future: MongoDB Integration

To persist data, you can integrate MongoDB:

1. Install Mongoose: `npm install mongoose`
2. Create `.env` file with MongoDB connection string
3. Replace in-memory storage with Mongoose models

## Deployment

### Build for Production

```bash
# Build React frontend
cd client && npm run build

# Run production server
NODE_ENV=production node server.js
```

### Deploy to Cloud

Example platforms:
- Heroku
- AWS
- DigitalOcean
- Vercel (frontend)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License

## Support

For issues or questions, please create an issue in the repository.
