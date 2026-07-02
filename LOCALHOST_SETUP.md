# FounderCheck - Local Development Setup

## 🚀 Quick Access URLs

### Frontend (React App)
```
http://localhost:5173
```
- User interface for startup analysis
- Dashboard with all 15 systems
- Real-time analysis display
- PDF export functionality

### Backend API
```
http://localhost:9001
```
- RESTful API endpoints
- OpenAI integration
- Data processing and analysis
- 195+ endpoints available

### Health Check
```
http://localhost:9001/health
```
Returns API status:
```json
{
  "status": "operational",
  "message": "API Keys: OpenAI=✓"
}
```

---

## 📋 Environment Configuration

### Current .env Settings
```
BACKEND_PORT=9001
BACKEND_HOST=0.0.0.0
VITE_API_URL=http://localhost:9001
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:9001
LLM_PROVIDER=openai
MODEL_NAME=gpt-3.5-turbo
```

### Key Configuration Files
- **Backend**: `backend/main.py`
- **Frontend**: `frontend/src/App.tsx`
- **Environment**: `.env` (current settings)
- **Example**: `.env.example` (template)

---

## 🔄 Development Workflow

### 1. Start Backend
```bash
cd backend
python main.py
```
- Runs on: `http://localhost:9001`
- Status: Check `/health` endpoint
- Logs: Console output shows analysis progress

### 2. Start Frontend
```bash
cd frontend
npm run dev
```
- Runs on: `http://localhost:5173`
- Auto-reload: Changes reflected instantly
- Dev server: Vite development server

### 3. Access Application
```
http://localhost:5173
```
- Frontend loads from http://localhost:5173
- Frontend calls backend at http://localhost:9001/api/v1/*
- All API requests proxied through CORS middleware

---

## 📊 Analysis Flow

### Request Path
```
Frontend (5173)
    ↓
HTTP POST to http://localhost:9001/api/v1/analyze
    ↓
Backend processes (9001)
    ↓
OpenAI API calls (parallel)
    ↓
Response returned to Frontend
    ↓
Display in UI (30-45 seconds)
```

### Key Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | API health check |
| `/api/v1/analyze` | POST | Quick startup analysis (45 sec) |
| `/api/v1/analyze/{id}/extended` | POST | Extended analysis (+45 sec) |
| `/api/v1/analyses` | GET | List all analyses |
| `/api/v1/analyses/{id}` | GET | Get specific analysis |

---

## 🐛 Troubleshooting

### Frontend can't connect to Backend
**Error**: `Failed to analyze idea` or `Network error`

**Solution**:
1. Check backend is running: `curl http://localhost:9001/health`
2. Verify .env has: `VITE_API_URL=http://localhost:9001`
3. Check CORS is enabled in backend
4. Restart frontend dev server

### Backend won't start on port 9001
**Error**: `[Errno 10048] only one usage of each socket address`

**Solution**:
1. Kill existing process: `lsof -ti:9001 | xargs kill -9`
2. Or change BACKEND_PORT in .env
3. Update VITE_API_URL to match

### Analysis takes too long
**Expected**: 30-45 seconds for quick analysis

**If longer**:
1. Check internet connection (OpenAI API calls)
2. Monitor backend logs for errors
3. Verify OpenAI API key is valid
4. Check rate limiting

### Competitors tab shows nothing
**Solution**:
1. Refresh browser (Ctrl+R)
2. Re-analyze startup idea
3. Wait full 45 seconds for complete analysis
4. Verify backend is returning competitor_analysis data

---

## 📱 Supported Platforms

### Development
- ✅ Windows 10/11 (Local)
- ✅ macOS (Local)
- ✅ Linux (Local)

### Browsers
- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari

### Responsive Design
- ✅ Desktop (1920x1080+)
- ✅ Tablet (768x1024)
- ✅ Mobile (360x640) - Limited

---

## 🔐 Security Notes

### Local Development
- No authentication required
- Open CORS for localhost:5173 only
- API keys stored in .env (not committed)
- SQLite database (no credentials needed)

### Production Deployment
- Implement authentication layer
- Restrict CORS origins
- Use environment-based API keys
- Switch to PostgreSQL
- Enable HTTPS

---

## 📦 Port References

| Service | Port | URL | Status |
|---------|------|-----|--------|
| **Frontend** | 5173 | `http://localhost:5173` | ✓ Running |
| **Backend** | 9001 | `http://localhost:9001` | ✓ Running |
| **PostgreSQL** | 5432 | `localhost:5432` | Optional |
| **Chroma DB** | N/A | `./data/chroma_db` | Optional |

---

## 🎯 Common Tasks

### Run Analysis
1. Go to `http://localhost:5173`
2. Enter startup idea (min 10 characters)
3. Click "Analyze My Idea"
4. Wait 30-45 seconds
5. View results in tabs

### Export PDF Report
1. Complete analysis
2. Click "Download PDF" button
3. Professional report generated
4. Save to computer

### View Extended Analysis
1. After quick analysis complete
2. Click "Get Extended Analysis" (optional)
3. Wait additional 30-45 seconds
4. View SWOT, GTM, Financial, etc.

### Check API Response
```bash
curl -X POST http://localhost:9001/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"idea":"Your startup idea here"}'
```

---

## 📞 Support

### Check Backend Logs
```bash
tail -f /tmp/backend_fast.log
```

### Monitor Analysis Progress
- Backend console shows: `[1/6] Extracting...` to `[6/6] Done`
- Expected duration: 30-45 seconds
- Optional extended: +30-45 seconds

### Verify Configuration
```bash
# Check .env file
cat .env | grep -E "PORT|URL|PROVIDER"

# Check running processes
ps aux | grep -E "python|node"

# Test endpoints
curl http://localhost:9001/health
curl http://localhost:5173
```

---

## 📝 Notes

- **Analysis Time**: 30-45 seconds (4x faster than before)
- **Parallel Processing**: 6 core analyses run simultaneously
- **Flexible Depth**: Quick or extended analysis modes
- **Real-Time**: Live OpenAI API integration
- **Multi-Language**: English, Bengali, Hindi support
- **Regional**: Bangladesh, India, Pakistan, SE Asia

---

**Last Updated**: July 3, 2026  
**Status**: Production Ready ✓
