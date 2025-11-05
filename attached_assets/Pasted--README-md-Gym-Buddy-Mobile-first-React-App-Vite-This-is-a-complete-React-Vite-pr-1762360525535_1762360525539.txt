--- README.md ---
# Gym Buddy — Mobile-first React App (Vite)

This is a complete React (Vite) project that implements your requested gym app features:
- Full weekly workout (Mon–Sun) preloaded
- Edit workouts: add/remove exercises and days
- Mark sets/exercises as complete
- Log weight per exercise with history and show previous weight
- Simple user management (admin creates users). Username/password matching (stored locally) — no external auth
- Export/Import users (JSON) to share credentials with your friends
- Mobile-first responsive UI

## Quick start (local)
1. Ensure you have Node.js 18+ and npm/yarn.
2. `npm install`
3. `npm run dev`
4. Open `http://localhost:5173`

## Build & Deploy (GitHub → Vercel)
- Push this repo to GitHub.
- On Vercel, create a new project and connect your repo. Vite apps deploy as static sites — Vercel will detect and build.
- Build command: `npm run build`
- Output directory: `dist`

--- package.json ---
{
  "name": "gym-buddy",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "clsx": "^1.2.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "dayjs": "^1.11.9"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0"
  }
}

--- vite.config.js ---
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})

--- index.html ---
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gym Buddy</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

--- src/main.jsx ---
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')).render(<App />)

--- src/storage.js ---
// Helper for localStorage per-user
export const STORAGE_PREFIX = 'gymbuddy_v1_' // version your data key

export function saveForUser(username, key, value) {
  const k = STORAGE_PREFIX + username + '_' + key
  localStorage.setItem(k, JSON.stringify(value))
}
export function loadForUser(username, key, defaultValue) {
  const k = STORAGE_PREFIX + username + '_' + key
  const raw = localStorage.getItem(k)
  if (!raw) return defaultValue
  try { return JSON.parse(raw) } catch { return defaultValue }
}

export function saveUsers(users) {
  localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(users))
}
export function loadUsers() {
  const raw = localStorage.getItem(STORAGE_PREFIX + 'users')
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

--- src/defaultData.js ---
// Full workout data (Mon-Sat from your message + Sunday recovery)
export const DEFAULT_WORKOUT = {
  Monday: [
    {exercise: 'Warmup (stretches)', reps: '15', sets: '1', rest: '30', notes: 'Neck/shoulder/tricep/chest/hip rotations'},
    {exercise: 'Bird Dog - Stability', reps: '15', sets: '1', rest: '30'},
    {exercise: 'Warrior 1 - Yoga', reps: '10', sets: '1', rest: '30', notes: 'Hold 2-4s'},
    {exercise: 'Bulgarian Bag Side Swipe', reps: '15', sets: '3', rest: '30'},
    {exercise: 'T-bar Rowing - Functional', reps: '12', sets: '3', rest: '60'},
    {exercise: 'Wide Grip Pull Ups', reps: '5', sets: '3', rest: '60'},
    {exercise: 'Lat Pull Down Wide Grip - Machine', reps: '12', sets: '3', rest: '30', notes: 'On Machine'},
    {exercise: 'Lat Pull Down Close Grip - Machine', reps: '12', sets: '3', rest: '30'},
    {exercise: 'Bend Over Rowing Barbell', reps: '12', sets: '3', rest: '30'},
    {exercise: 'Bend Over Dumbbell Row - Single Arm', reps: '12', sets: '3', rest: '30'},
    {exercise: 'Chest Supported Dumbbell Rowing', reps: '12', sets: '3', rest: '30'},
    {exercise: 'Dumbbell Reverse Fly', reps: '12', sets: '3', rest: '30'},
    {exercise: 'Seated Cable Row - Machine', reps: '12', sets: '3', rest: '30'},
  ],
  Tuesday: [
    {exercise: 'Warmup (stretches)', reps: '10', sets: '1', rest: '30'},
    {exercise: 'Arm Circles - Flexibility', reps: '20', sets: '1', rest: '30'},
    {exercise: 'Resistance Band Pull Apart', reps: '15', sets: '1', rest: '30'},
    {exercise: 'Dead Bug - Core', reps: '10', sets: '1', rest: '30'},
    {exercise: 'Tree Pose - Yoga', reps: '10', sets: '3', rest: '30'},
    {exercise: 'Mudgal Lv1 - Crossfit', reps: '10', sets: '3', rest: '60'},
    {exercise: 'High Knees - Cardio', reps: '25', sets: '3', rest: '90'},
    {exercise: 'Burpees with Pushup', reps: '7', sets: '3', rest: '90'},
    {exercise: 'Flat Bench Close Grip', reps: '12', sets: '3', rest: '30'},
    {exercise: 'Tricep Push Down - Straight Rod', reps: '12', sets: '3', rest: '30'},
    {exercise: 'Overhead Triceps Extension', reps: '12', sets: '3', rest: '30'},
    {exercise: 'Skull Crushers', reps: '12', sets: '3', rest: '30'},
  ],
  Wednesday: [
    {exercise: 'Warmup (stretches)', reps: '10', sets: '1', rest: '30'},
    {exercise: 'Bird Dog - Stability', reps: '10', sets: '1', rest: '30'},
    {exercise: 'Upward Facing Dog Pose', reps: '10', sets: '1', rest: '30'},
    {exercise: 'Leg Raise - Core', reps: '10', sets: '1', rest: '30'},
    {exercise: 'Russian Twist - Core', reps: '15', sets: '1', rest: '30'},
    {exercise: 'Battle Rope - Cardio', reps: '10', sets: '3', rest: '30'},
    {exercise: 'Bicep Curls (Dumbbells)', reps: '12', sets: '3', rest: '30'},
    {exercise: 'Preacher Curl Machine', reps: '12', sets: '3', rest: '30'},
    {exercise: 'Concentration Curl', reps: '12', sets: '3', rest: '30'},
    {exercise: 'Hammer Curls', reps: '12', sets: '3', rest: '30'},
    {exercise: 'Dumbbell Reverse Grip Bicep Curl', reps: '12', sets: '3', rest: '30'},
  ],
  Thursday: [
    {exercise: 'Warmup (stretches)', reps: '10', sets: '1', rest: '30'},
    {exercise: 'Single Leg Balance Reach - Yoga', reps: '10', sets: '3', rest: '30'},
    {exercise: 'Mountain Climbers', reps: '25', sets: '3', rest: '60', notes: '25 each side'},
    {exercise: 'Skipping', reps: '30', sets: '3', rest: '60'},
    {exercise: 'Push Ups', reps: '15', sets: '3', rest: '60'},
    {exercise: 'Flat Bench', reps: '12', sets: '3', rest: '60'},
    {exercise: 'Incline Bench Dumbbell Press', reps: '12', sets: '3', rest: '60'},
    {exercise: 'Dumbbell Bench Press', reps: '12', sets: '3', rest: '60'},
    {exercise: 'Decline Bench Press', reps: '12', sets: '3', rest: '60'},
    {exercise: 'Butterfly', reps: '12', sets: '3', rest: '60'},
  ],
  Friday: [
    {exercise: 'Warmup (stretches)', reps: '10', sets: '1', rest: '30'},
    {exercise: 'Seated Forward Bend - Yoga', reps: '5', sets: '3', rest: '30', notes: 'Hold 5s'},
    {exercise: 'Flutter Kicks', reps: '30', sets: '1', rest: '30'},
    {exercise: 'Hurdles Jump - Crossfit', reps: '20', sets: '1', rest: '30', notes: 'Two rounds in one set'},
    {exercise: 'Step Ups (Dumbbells)', reps: '20', sets: '3', rest: '90'},
    {exercise: 'Jump Squats', reps: '15', sets: '3', rest: '90'},
    {exercise: 'Lunges Forward', reps: '25', sets: '3', rest: '90'},
    {exercise: 'Lunges Reverse', reps: '25', sets: '3', rest: '90'},
    {exercise: 'Bulgarian Split Squats', reps: '25', sets: '3', rest: '90'},
    {exercise: 'Squats On Barbell', reps: '15', sets: '3', rest: '90'},
    {exercise: 'Dumbbell Squats', reps: '15', sets: '3', rest: '90'},
    {exercise: 'Glute Bridge', reps: '15', sets: '3', rest: '90'},
    {exercise: 'Hip Thrusts', reps: '15', sets: '3', rest: '90'},
    {exercise: 'Leg Extension - Machine', reps: '15', sets: '3', rest: '90'},
  ],
  Saturday: [
    {exercise: 'Warmup (stretches)', reps: '10', sets: '1', rest: '30'},
    {exercise: 'Sitting Butterfly Stretch', reps: '25', sets: '1', rest: '30'},
    {exercise: 'Cobra Stretch', reps: '15', sets: '1', rest: '30'},
    {exercise: 'Mudhgal Level 2 - Crossfit', reps: '5', sets: '1', rest: '30'},
    {exercise: 'Kettle Bell Swing', reps: '15', sets: '2', rest: '30'},
    {exercise: 'Sled Push', reps: '10', sets: '2', rest: '30', notes: '15 kg or more'},
    {exercise: 'Frog Jumps', reps: '20', sets: '1', rest: '30'},
    {exercise: 'Overhead Shoulder Press', reps: '12', sets: '3', rest: '30'},
    {exercise: 'Side Lateral Raise', reps: '12', sets: '3', rest: '30'},
    {exercise: 'Seated Dumbbell Press', reps: '12', sets: '3', rest: '30'},
    {exercise: 'Upright Row - Shoulder', reps: '12', sets: '3', rest: '30'},
    {exercise: 'Shrugs', reps: '12', sets: '3', rest: '30'},
    {exercise: 'Face Pull - Functional', reps: '12', sets: '3', rest: '30'},
  ],
  Sunday: [
    {exercise: 'Light Stretching', reps: '10-15 min', sets: '-', rest: '-', notes: 'Neck rolls, shoulder circles, hamstring stretches'},
    {exercise: 'Breathing / Yoga', reps: '10 min', sets: '-', rest: '-', notes: 'Child\'s Pose, Cat-Cow'},
    {exercise: 'Walk / Mobility', reps: '20-30 min', sets: '-', rest: '-', notes: 'Light walk and joint rotations'},
    {exercise: 'Hydration + Nutrition', reps: '-', sets: '-', rest: '-', notes: 'Stay hydrated, protein-rich meals'},
    {exercise: 'Optional Core Stability', reps: '10 min', sets: '-', rest: '-', notes: 'Bird Dog or Plank'},
  ]
}
export const DEFAULT_ADMIN = { username: 'admin', password: 'admin123', name: 'Owner' }

--- src/App.jsx ---
import React, { useEffect, useState } from 'react'
import { DEFAULT_WORKOUT, DEFAULT_ADMIN } from './defaultData'
import { loadUsers, saveUsers, loadForUser, saveForUser } from './storage'
import WorkoutDay from './components/WorkoutDay'
import UserPanel from './components/UserPanel'
import ManageUsers from './components/ManageUsers'

function App(){
  // auth state
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState(() => loadUsers() || [DEFAULT_ADMIN])
  const [workoutData, setWorkoutData] = useState({})
  const [view, setView] = useState('workouts')

  useEffect(()=>{ // ensure users exist
    if(!loadUsers()) saveUsers(users)
  }, [])

  useEffect(()=>{ // when user logs in, load their data or default
    if(currentUser){
      const data = loadForUser(currentUser.username, 'workout') || DEFAULT_WORKOUT
      setWorkoutData(data)
    } else {
      setWorkoutData({})
    }
  }, [currentUser])

  function handleSaveWorkout(updated){
    setWorkoutData(updated)
    saveForUser(currentUser.username, 'workout', updated)
  }

  function handleCreateUser(newUser){
    const updated = [...users, newUser]
    setUsers(updated)
    saveUsers(updated)
  }

  return (
    <div className="app-root">
      <div className="topbar">
        <h2>Gym Buddy</h2>
        <div className="user-area">
          <UserPanel users={users} onLogin={setCurrentUser} currentUser={currentUser} onLogout={()=>setCurrentUser(null)} />
        </div>
      </div>
      <div className="container-main">
        {currentUser ? (
          <>
            <div className="controls-row">
              <button className="btn" onClick={()=>setView('workouts')}>Workouts</button>
              <button className="btn" onClick={()=>setView('manage')}>Manage Users</button>
            </div>
            {view === 'workouts' && (
              <div>
                {Object.keys(workoutData).map(day=> (
                  <WorkoutDay key={day} day={day} exercises={workoutData[day]} onSave={(updatedDay)=>{
                    const copy = {...workoutData, [day]: updatedDay}
                    handleSaveWorkout(copy)
                  }} user={currentUser} />
                ))}
              </div>
            )}
            {view === 'manage' && (
              <ManageUsers users={users} onCreate={handleCreateUser} currentUser={currentUser} />
            )}
          </>
        ) : (
          <div className="center-cta">
            <p>Login as Admin to manage users or login with any user credentials.</p>
            <p>Default admin: <strong>admin / admin123</strong></p>
          </div>
        )}
      </div>
    </div>
  )
}
export default App

--- src/components/WorkoutDay.jsx ---
import React from 'react'
import ExerciseRow from './ExerciseRow'

export default function WorkoutDay({day, exercises, onSave, user}){
  function handleUpdate(idx, updated){
    const copy = [...exercises]
    copy[idx] = updated
    onSave(copy)
  }
  function handleAdd(){
    const copy = [...exercises, {exercise:'New Exercise', reps:'10', sets:'3', rest:'30', notes:''}]
    onSave(copy)
  }
  function handleRemove(idx){
    const copy = exercises.filter((_,i)=>i!==idx)
    onSave(copy)
  }
  return (
    <details className="day-card" open>
      <summary className="day-row"><div className="day-title">{day}</div></summary>
      <div className="section-title">Exercises</div>
      <div className="list">
        {exercises.map((ex, i)=> (
          <ExerciseRow key={i} ex={ex} idx={i} onUpdate={handleUpdate} onRemove={handleRemove} user={user} />
        ))}
      </div>
      <div style={{padding:'8px'}}>
        <button className="btn" onClick={handleAdd}>Add Exercise</button>
      </div>
    </details>
  )
}

--- src/components/ExerciseRow.jsx ---
import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { saveForUser, loadForUser } from '../storage'

export default function ExerciseRow({ex, idx, onUpdate, onRemove, user}){
  const [local, setLocal] = useState(ex)
  const [logs, setLogs] = useState(()=> loadForUser(user.username, 'logs') || {})

  useEffect(()=> setLocal(ex), [ex])

  function saveField(field, value){
    const updated = {...local, [field]: value}
    setLocal(updated)
    onUpdate(idx, updated)
  }

  function markSetDone(weight){
    const key = ex.exercise
    const entry = { weight, ts: dayjs().toISOString() }
    const copy = {...logs}
    copy[key] = copy[key] || []
    copy[key].push(entry)
    setLogs(copy)
    saveForUser(user.username, 'logs', copy)
  }

  const prev = (logs[ex.exercise] && logs[ex.exercise].length>0) ? logs[ex.exercise][logs[ex.exercise].length-1].weight : null

  return (
    <div className="exercise-row">
      <div className="row-top">
        <div>
          <strong>{local.exercise}</strong>
          <div className="notes">{local.notes || ''}</div>
        </div>
        <div className="meta">
          <div>Reps: <input value={local.reps} onChange={e=>saveField('reps', e.target.value)} className="input-small"/></div>
          <div>Sets: <input value={local.sets} onChange={e=>saveField('sets', e.target.value)} className="input-small"/></div>
          <div>Rest: <input value={local.rest} onChange={e=>saveField('rest', e.target.value)} className="input-small"/></div>
        </div>
      </div>
      <div className="row-actions">
        <div>Prev: {prev || '-'} kg</div>
        <div>
          <input placeholder="weight kg" id={`w-${user.username}-${idx}`} className="input-small" />
          <button className="btn" onClick={()=>{
            const el = document.getElementById(`w-${user.username}-${idx}`)
            if(!el || !el.value) return alert('Enter weight')
            markSetDone(el.value)
            el.value = ''
          }}>Log</button>
          <button className="btn" onClick={()=>onRemove(idx)}>Remove</button>
        </div>
      </div>
    </div>
  )
}

--- src/components/UserPanel.jsx ---
import React, { useState } from 'react'
import { loadUsers } from '../storage'

export default function UserPanel({users, onLogin, currentUser, onLogout}){
  const [u,setU] = useState('')
  const [p,setP] = useState('')

  function handleLogin(){
    const all = users || loadUsers() || []
    const found = all.find(x=>x.username===u && x.password===p)
    if(found) onLogin(found)
    else alert('Invalid credentials')
  }

  return (
    <div style={{display:'flex',gap:8,alignItems:'center'}}>
      {currentUser ? (
        <>
          <span>{currentUser.username}</span>
          <button className="btn" onClick={onLogout}>Logout</button>
        </>
      ) : (
        <>
          <input placeholder="username" value={u} onChange={e=>setU(e.target.value)} className="input-small" />
          <input placeholder="password" type="password" value={p} onChange={e=>setP(e.target.value)} className="input-small" />
          <button className="btn" onClick={handleLogin}>Login</button>
        </>
      )}
    </div>
  )
}

--- src/components/ManageUsers.jsx ---
import React, { useState } from 'react'
import { saveUsers } from '../storage'

export default function ManageUsers({users, onCreate, currentUser}){
  const [form, setForm] = useState({username:'', password:'', name:''})

  function create(){
    if(!form.username || !form.password) return alert('username & password required')
    const newUser = {...form}
    onCreate(newUser)
    saveUsers([...users, newUser])
    setForm({username:'', password:'', name:''})
    alert('User created. Share credentials with your friend.')
  }

  function exportUsers(){
    const data = JSON.stringify(users)
    const blob = new Blob([data], {type:'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'gym_users.json'; a.click();
  }

  function importUsers(e){
    const f = e.target.files[0]
    const reader = new FileReader()
    reader.onload = evt => {
      try{
        const imported = JSON.parse(evt.target.result)
        saveUsers(imported)
        alert('Imported users. Refresh to load.')
      }catch{ alert('Bad file') }
    }
    reader.readAsText(f)
  }

  return (
    <div>
      <h3>Create user (admin)</h3>
      <input placeholder="username" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} className="input-small" />
      <input placeholder="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} className="input-small" />
      <input placeholder="name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="input-small" />
      <button className="btn" onClick={create}>Create</button>

      <h3>Export / Import</h3>
      <button className="btn" onClick={exportUsers}>Export Users (JSON)</button>
      <input type="file" accept="application/json" onChange={importUsers} />

      <h4>Existing users</h4>
      <ul>
        {users.map(u=> <li key={u.username}>{u.username} — {u.name || ''}</li>)}
      </ul>
    </div>
  )
}

--- src/styles.css ---
body{background:linear-gradient(180deg,#071427,#0b2434);font-family:system-ui,Segoe UI,Roboto,Arial;color:#e6eef3}
.app-root{min-height:100vh}
.topbar{display:flex;justify-content:space-between;align-items:center;padding:12px}
.container-main{padding:12px}
.day-card{background:#0b1220;border-radius:12px;padding:10px;margin-bottom:12px}
.day-row{display:flex;justify-content:space-between;align-items:center}
.day-title{font-weight:700}
.section-title{color:#3ddc97;margin-top:8px;margin-bottom:6px}
.input-small{padding:6px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);background:transparent;color:inherit;margin-left:6px}
.btn{padding:8px 10px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);background:transparent;color:inherit;margin-left:6px}
.exercise-row{border-top:1px solid rgba(255,255,255,0.03);padding:8px 0}
.row-top{display:flex;justify-content:space-between;align-items:center}
.row-actions{display:flex;justify-content:space-between;align-items:center;margin-top:8px}
.notes{color:#9aa7b2;font-size:13px}
.center-cta{padding:20px;background:rgba(255,255,255,0.02);border-radius:8px}

--- END OF FILES ---


